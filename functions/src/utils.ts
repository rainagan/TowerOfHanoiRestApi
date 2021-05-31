import Ajv from 'ajv';
import { InvalidOperationError, KeyNotFoundError, ValidationError } from './errorTypes';

const ajv = new Ajv();
const updateSchema = {
    type: 'object',
    properties: {
        from: {type: 'string', nullable: false},
        to: {type: 'string', nullable: false}
    },
    required: ['from', 'to'],
    additionalProperties: false
}
const validate = ajv.compile(updateSchema);

/**
 * Update a specified game state if the attempt move is valid
 * @param requestBody The request body 
 * @param documentRef The reference to the specified Firestore Document 
 * @returns A Promise resolved with an updated document data 
 * @throws {ValidationError} Request must in the format { 'from':'rod1'/'rod2'/'rod3', 'to:'rod1'/'rod2'/'rod3' }. Also, values for 'from' and 'to' must not match
 * @throws {KeyNotFoundError} Specified data must exist in the database
 * @throws {InvalidOperationError} A move is only valid when moving a disk to an empty rod, or moving a smaller disk onto a larger one 
 */
export async function tryUpdate(
    requestBody: any,
    documentRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>): Promise<any> {
        const fromRod = requestBody.from;
        const toRod = requestBody.to;

        if (!validate(requestBody) || !isValidRod(fromRod, toRod)) {
            throw new ValidationError(`Invalid request: ${JSON.stringify(requestBody)}`);
        }

        const documentData = await documentRef
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    return null;
                } else {
                    return doc.data();
                }
            });
        if (documentData == null) {
            throw new KeyNotFoundError();
        }

        const fromDisks = documentData[fromRod] as number[];
        let toDisks = documentData[toRod] as number[];

        const movingDisk = fromDisks.shift();
        if (movingDisk == null) {
            throw new InvalidOperationError();
        }
        
        if (toDisks == null) {
            toDisks = new Array<number>();
        }
        toDisks.unshift(movingDisk!);

        if (!areDisksAscending(toDisks)) {
            throw new InvalidOperationError();
        }

        await documentRef.update(documentData);

        return documentData;
}

/**
 * Build a string response body that will send back to the client
 * @param resultObject A result object that needs to be stringified
 * @param prefix An optional string that can be added before the stringified resultObject
 * @returns The built-up string response
 */
export function buildResponseBody(resultObject: any, prefix = ''): string {
    const victory = isVictory(resultObject);
    const stateResult = JSON.stringify(resultObject).concat(`\nIs victory: ${victory}`);
    return prefix === ''
        ? stateResult
        : prefix.concat(stateResult);
}

/**
 * Check if the specified 'from' and 'to' rods are valid
 * @param fromRod The rod to move a disk from
 * @param toRod The rod to move a disk to
 * @returns True if both specified rods are valid
 */
function isValidRod(fromRod: string, toRod: string): boolean {
    const validRods = ['rod1', 'rod2', 'rod3'];
    return validRods.indexOf(fromRod) > -1
        && validRods.indexOf(toRod) > -1;
}

/**
 * Check if disks are stacked with their diameters in ascending order (the upper disk is smaller than the one underneath) 
 * @param disks A number[] indicating disks with different diameters
 * @returns True if disks are stacked with their diameters in ascending order
 */
function areDisksAscending(disks: number[]): boolean {
    const stackLength = disks.length;

    if (stackLength === 0) {
        return true;
    }

    for (let diskNumber = 0; diskNumber < disks.length - 1; diskNumber++) {
        if (disks[diskNumber] >= disks[diskNumber + 1]) {
            return false;
        }
    }

    return true;
}

/**
 * Check if the specified game meets victory 
 * @param data The data to be checked
 * @return True if victory is meet; otherwise false
 */
 function isVictory(data: any): boolean {
    const rod1 = data.rod1 as number[];
    const rod2 = data.rod2 as number[];
    const rod3 = data.rod3 as number[];

    return rod1.length === 0
        && rod2.length === 0
        && rod3.length === 4
        && areDisksAscending(rod3);
}