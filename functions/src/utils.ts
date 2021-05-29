import { InvalidOperationError, KeyNotFoundError, ValidationError } from "./errorTypes";

/**
 * Check if the specified game meets victory 
 * @param documentData
 * @return true if victory is meet; otherwise false
 */
export function isVictory(documentData: FirebaseFirestore.DocumentData): boolean {
    const rod1 = documentData.rod1 as number[];
    const rod2 = documentData.rod2 as number[];
    const rod3 = documentData.rod3 as number[];

    return rod1.length === 0
        && rod2.length === 0
        && rod3.length === 4
        && areDisksAscending(rod3);
}

/**
 * Check if the proposed move is valid
 * @param requestBody
 * @param documentRef
 * @returns true if the proposed move is valid; false otherwise 
 */
export async function tryUpdate(
    requestBody: any,
    documentRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>) {
        const fromRod = requestBody.from;
        const toRod = requestBody.to;
        if (!isValidRod(fromRod, toRod)) {
            throw new ValidationError(`Invalid request: ${requestBody}`);
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

function isValidRod(fromRod: string, toRod: string): boolean {
    const validRods = ['rod1', 'rod2', 'rod3'];
    return validRods.indexOf(fromRod) > -1
        && validRods.indexOf(toRod) > -1
        && fromRod !== toRod;
}

 function areDisksAscending(diskStack: number[]): boolean {
    const stackLength = diskStack.length;

    if (stackLength === 0) {
        return true;
    }

    for (let diskNumber = 0; diskNumber < diskStack.length - 1; diskNumber++) {
        if (diskStack[diskNumber] >= diskStack[diskNumber + 1]) {
            return false;
        }
    }

    return true;
}