import Ajv from 'ajv';
import * as cors from 'cors';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { nanoid } from 'nanoid';
import { InvalidOperationError, KeyNotFoundError, ValidationError } from './errorTypes';
import { isVictory, tryUpdate } from './utils';

const ajv = new Ajv();
const updateSchema = {
    type: "object",
    properties: {
        from: {type: "string", nullable: false},
        to: {type: "string", nullable: false}
    },
    required: ["from", "to"],
    additionalProperties: false
}
const validate = ajv.compile(updateSchema);

admin.initializeApp({
    credential: admin.credential.cert({
      privateKey: functions.config().private.key.replace(/\\n/g, '\n'),
      projectId: functions.config().project.id,
      clientEmail: functions.config().client.email
    })
});

const app = express();
app.use(cors({ origin: true }));

const main = express();
main.use('/api', app);
main.use(express.json());
main.use(express.urlencoded({ extended: true }));

exports.webApi = functions.https.onRequest(main);

const gameCollection = admin.firestore().collection('/games');

// Create
app.post('/create', async (_req, res) => {
    const uid = nanoid();
    const gameState = {
        gameId: uid,
        rod1: [1,2,3,4],
        rod2: [],
        rod3: []
    };

    const document = gameCollection.doc('/' + uid + '/');
    await document
        .create(gameState)
        .then(() => {
            res.status(201).send(`Created a new game: ${JSON.stringify(gameState)}`);
        })
        .catch((error) => {
            errorHandler(error, res);
        });
});

// Read
app.get('/read/:gameId', async (req, res) => {
    await gameCollection
        .doc(req.params.gameId.trim())
        .get()
        .then((doc) => {
            if (!doc.exists) {
                throw new KeyNotFoundError();
            } else {
                const documentData = doc.data();
                const victory = isVictory(documentData!);
                const response = JSON.stringify(documentData).concat(`\nIs victory: ${victory}`);

                res.status(200).send(response);
            }
        })
        .catch((error) => {
            errorHandler(error, res);
        });
});

// Update
app.put('/update/:gameId', async (req, res) => {
    try {
        const requestBody = req.body;
        if (!validate(requestBody)) {
            throw new ValidationError(`Invalid request: ${requestBody}`);
        }
        
        const document = gameCollection.doc(req.params.gameId.trim());

        await tryUpdate(requestBody, document)
            .then((result) => {
                const victory = isVictory(result);

                const response = `Updated game state to: ${JSON.stringify(result)}\nIs victory: ${victory}`;

                res.status(200).send(response);
            });
    } catch (error) {
        errorHandler(error, res);
    }
});

// Delete
app.delete('/delete/:gameId', async (req, res) => {
    try {
        const gameId = req.params.gameId.trim();
        const document = gameCollection.doc(gameId);
        await document
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    throw new KeyNotFoundError();
                } 
            });

        await gameCollection
            .doc(gameId)
            .delete()
            .then(() => {
                res.status(200).send(`Deleted game session: ${gameId}`);
            });
    } catch (error) {
        errorHandler(error, res);
    }
});

export { app };

function errorHandler(
    error: Error,
    res: any) {
        console.log(error);

        if (error instanceof KeyNotFoundError) {
            res.status(404).send(error.message);
        } else if (error instanceof ValidationError) {
            res.status(400).send(error.message);
        } else if (error instanceof InvalidOperationError) {
            res.status(403).send(error.message);
        } else{
            res.status(500).send('Unable to update game state');
        }
}
