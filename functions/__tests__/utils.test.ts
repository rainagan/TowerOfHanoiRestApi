import { buildResponseBody } from '../src/utils';

describe('Build Resoinse Body testing', () => {
    it('Should only return the stringified result object with victory status when prefix is empty', () => {
        expect(buildResponseBody(
            {
                gameId: 'abc',
                rod1: [],
                rod2: [],
                rod3: [1, 2, 3, 4] 
            }))
            .toBe('{"gameId":"abc","rod1":[],"rod2":[],"rod3":[1,2,3,4]}\nIs victory: true');
    });

    it('Should return the concatination of the prefix string and the stringified result object with vistory status when prefix is not empty', () => {
        expect(buildResponseBody(
            {
                gameId: 'abc',
                rod1: [1, 2, 3, 4],
                rod2: [],
                rod3: []
            },
            'Some prefix'))
            .toBe('Some prefix{"gameId":"abc","rod1":[1,2,3,4],"rod2":[],"rod3":[]}\nIs victory: false');
    });
});

describe('Try Update testing', () => {
    describe('Throw ValidationError testing', () => {
        it('Should throw if request contains invalid data', () => {
            // UNIMPLEMENTED DUE TO UNFAMILIARITY WITH TS TESTING FRAMEWORD
        });
    
        it('Should throw if requests invalid rod', () => {
            // UNIMPLEMENTED DUE TO UNFAMILIARITY WITH TS TESTING FRAMEWORD
        });
    });

    it('Should throw KeyNotFoundError if document does not exist', () => {
        // UNIMPLEMENTED DUE TO UNFAMILIARITY WITH TS TESTING FRAMEWORD
    });
    
    describe('Throw InvalidOperationError testing', () => {
        it('Should throw if trying to move a disk from an empty rod', () => {
            // UNIMPLEMENTED DUE TO UNFAMILIARITY WITH TS TESTING FRAMEWORD
        });
    
        it('Should throw if trying to move a larger disk onto a smaller disk', () => {
            // UNIMPLEMENTED DUE TO UNFAMILIARITY WITH TS TESTING FRAMEWORD
        });
    });
    
    it('Should be OK if attempted move is valid', () => {
        // UNIMPLEMENTED DUE TO UNFAMILIARITY WITH TS TESTING FRAMEWORD
    });
});