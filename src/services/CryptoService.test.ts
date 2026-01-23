/**
 * CryptoService Security Verification
 * Tests Context-Bound Authenticated Encryption (AAD)
 */

import { describe, it, expect } from 'vitest';
import { CryptoService, generateSalt, EncryptedPayload } from './CryptoService';

describe('CryptoService Security Hardening', () => {
    const PASSPHRASE = 'correct-horse-battery-staple';
    const TEST_DATA = 'Sensitive Task Title';
    const CONTEXT_A = 'task-123';
    const CONTEXT_B = 'task-456';

    it('should encrypt with context (v2)', async () => {
        const crypto = CryptoService.getInstance();
        await crypto.setupVault(PASSPHRASE);

        const encrypted = await crypto.encryptData(TEST_DATA, CONTEXT_A);

        expect(encrypted.version).toBe(2);
        expect(encrypted.context).toBe(CONTEXT_A);
        expect(encrypted.ciphertext).toBeDefined();
        expect(encrypted.iv).toBeDefined();
        expect(encrypted.salt).toBeDefined();
    });

    it('should decrypt successfully with correct context', async () => {
        const crypto = CryptoService.getInstance();
        await crypto.setupVault(PASSPHRASE);

        const encrypted = await crypto.encryptData(TEST_DATA, CONTEXT_A);
        const decrypted = await crypto.decryptData(encrypted, CONTEXT_A);

        expect(decrypted).toBe(TEST_DATA);
    });

    it('should FAIL to decrypt with WRONG context (AAD Mismatch)', async () => {
        const crypto = CryptoService.getInstance();
        await crypto.setupVault(PASSPHRASE);

        const encrypted = await crypto.encryptData(TEST_DATA, CONTEXT_A);

        // ATTACK: Try to decrypt Task A's payload using Task B's context
        await expect(crypto.decryptData(encrypted, CONTEXT_B))
            .rejects
            .toThrow(/Decryption failed/);
    });

    it('should FAIL to decrypt v2 payload if context is missing during decrypt', async () => {
        const crypto = CryptoService.getInstance();
        await crypto.setupVault(PASSPHRASE);

        const encrypted = await crypto.encryptData(TEST_DATA, CONTEXT_A);

        // Missing context should fail for v2
        await expect(crypto.decryptData(encrypted, undefined))
            .rejects
            .toThrow(/Decryption failed/);
    });

    it('should support backward compatibility (v1 payload)', async () => {
        const crypto = CryptoService.getInstance();
        await crypto.setupVault(PASSPHRASE);

        // Manually construct a v1 payload (simulate old data created WITHOUT context)
        // We simulate this by encrypting with NO context, which creates v2 with undefined AAD.
        // Then we fake the version to 1.

        const encryptedV2NoContext = await crypto.encryptData(TEST_DATA);

        const legacyPayload: EncryptedPayload = {
            ...encryptedV2NoContext,
            version: 1, // Lie about version to force fallback path
            context: undefined
        };

        // Decrypting v1 (even with a context passed!) should IGNORE the context and succeed
        const decrypted = await crypto.decryptData(legacyPayload, 'irrelevant-context');
        expect(decrypted).toBe(TEST_DATA);
    });
});
