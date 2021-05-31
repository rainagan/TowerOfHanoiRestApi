import { InvalidOperationError, KeyNotFoundError, ValidationError } from "../src/errorTypes";

describe('Validate Error', () => {
    it('Should have expected name and default message', () => {
        const error = new ValidationError();

        expect(error.name).toBe('ValidationError');
        expect(error.message).toBe('Invalid request');
    });

    it('Should have expected customized message', () => {
        const message = 'Invalid request syntax';
        const error = new ValidationError(message);

        expect(error.message).toBe(message);
    });
});

describe('Invalid Operation Error', () => {
    it('Should have expected name and default message', () => {
        const error = new InvalidOperationError();

        expect(error.name).toBe('InvalidOperationError');
        expect(error.message).toBe('Intended move is invalid');
    });

    it('Should have expected customized message', () => {
        const message = 'Intended request is invalid';
        const error = new InvalidOperationError(message);

        expect(error.message).toBe(message);
    });
});

describe('Key Not Found Error', () => {
    it('Should have expected name and default message', () => {
        const error = new KeyNotFoundError();

        expect(error.name).toBe('KeyNotFoundError');
        expect(error.message).toBe('Game session does not exist');
    });

    it('Should have expected customized message', () => {
        const message = 'Data does not exist';
        const error = new KeyNotFoundError(message);

        expect(error.message).toBe(message);
    });
});