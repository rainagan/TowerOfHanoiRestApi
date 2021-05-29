export class ValidationError extends Error {
    constructor(message = 'Invalid request') {
        super(message);
        this.name = 'ValidationError';
    }
}

export class InvalidOperationError extends Error {
    constructor(message = 'Intended move is invalid') {
        super(message);
        this.name = 'InvalidOperationError';
    }
}

export class KeyNotFoundError extends Error {
    constructor(message = 'Game session does not exist') {
        super(message);
        this.name = 'KeyNotFoundError';
    }
}