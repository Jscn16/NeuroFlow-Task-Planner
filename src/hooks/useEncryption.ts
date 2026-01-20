import { useState, useCallback, useEffect } from 'react';
import { CryptoService, EncryptedPayload } from '../services/CryptoService';
import { StorageService } from '../services/StorageService';

const VAULT_SALT_KEY = 'neuroflow-vault-salt';
const VAULT_INITIALIZED_KEY = 'neuroflow-vault-initialized';

interface UseEncryptionResult {
    isVaultSetup: boolean; // Has user ever set up encryption?
    isUnlocked: boolean; // Is vault currently unlocked?
    isLoading: boolean; // Is an operation in progress?
    error: string | null;

    setupVault: (passphrase: string) => Promise<boolean>;
    unlock: (passphrase: string) => Promise<boolean>;
    lock: () => void;
    resetVault: () => void;

    encryptData: (data: object) => Promise<EncryptedPayload>;
    decryptData: (payload: EncryptedPayload) => Promise<string>;
    decryptJSON: <T>(payload: EncryptedPayload) => Promise<T>;
}

export function useEncryption(): UseEncryptionResult {
    const crypto = CryptoService.getInstance();
    const storage = StorageService.getInstance();

    const [isVaultSetup, setIsVaultSetup] = useState(() => {
        // Synchronously check if vault exists to prevent initial render race conditions
        const salt = localStorage.getItem(VAULT_SALT_KEY);
        const initialized = localStorage.getItem(VAULT_INITIALIZED_KEY);
        return !!salt && initialized === 'true';
    });

    const [isUnlocked, setIsUnlocked] = useState(() => crypto.getIsUnlocked());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial check effect (can remain for updates, but initial state is now covered)
    useEffect(() => {
        const salt = localStorage.getItem(VAULT_SALT_KEY);
        const initialized = localStorage.getItem(VAULT_INITIALIZED_KEY);
        setIsVaultSetup(!!salt && initialized === 'true');
        setIsUnlocked(crypto.getIsUnlocked());
    }, []);

    /**
     * Set up vault for first time with new passphrase
     */
    const setupVault = useCallback(async (passphrase: string): Promise<boolean> => {
        if (!passphrase || passphrase.length < 8) {
            setError('Passphrase must be at least 8 characters');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { salt } = await crypto.setupVault(passphrase);

            // Store salt (not secret, just unique per user)
            localStorage.setItem(VAULT_SALT_KEY, salt);
            localStorage.setItem(VAULT_INITIALIZED_KEY, 'true');

            // Enable encryption mode in StorageService
            storage.enableEncryption();

            setIsVaultSetup(true);
            setIsUnlocked(true);
            return true;
        } catch (err) {
            setError('Failed to set up vault: ' + (err instanceof Error ? err.message : 'Unknown error'));
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Unlock existing vault with passphrase
     */
    const unlock = useCallback(async (passphrase: string): Promise<boolean> => {
        const salt = localStorage.getItem(VAULT_SALT_KEY);
        if (!salt) {
            setError('No vault found. Please set up encryption first.');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            await crypto.unlock(passphrase, salt);

            // Verify by attempting to decrypt stored verification marker
            // (Will be implemented when we migrate existing data)

            setIsUnlocked(true);
            return true;
        } catch (err) {
            setError('Invalid passphrase. Please try again.');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Lock vault - clear key from memory
     */
    const lock = useCallback(() => {
        crypto.lock();
        setIsUnlocked(false);
    }, []);

    /**
     * Reset vault - clears all encrypted data
     * WARNING: This is destructive!
     */
    const resetVault = useCallback(() => {
        crypto.lock();
        localStorage.removeItem(VAULT_SALT_KEY);
        localStorage.removeItem(VAULT_INITIALIZED_KEY);
        setIsVaultSetup(false);
        setIsUnlocked(false);
        setError(null);
    }, []);

    /**
     * Encrypt data
     */
    const encryptData = useCallback(async (data: object): Promise<EncryptedPayload> => {
        if (!crypto.getIsUnlocked()) {
            throw new Error('Vault is locked');
        }
        return crypto.encryptData(data);
    }, []);

    /**
     * Decrypt data to string
     */
    const decryptData = useCallback(async (payload: EncryptedPayload): Promise<string> => {
        if (!crypto.getIsUnlocked()) {
            throw new Error('Vault is locked');
        }
        return crypto.decryptData(payload);
    }, []);

    /**
     * Decrypt and parse JSON
     */
    const decryptJSON = useCallback(async <T,>(payload: EncryptedPayload): Promise<T> => {
        if (!crypto.getIsUnlocked()) {
            throw new Error('Vault is locked');
        }
        return crypto.decryptJSON<T>(payload);
    }, []);

    return {
        isVaultSetup,
        isUnlocked,
        isLoading,
        error,
        setupVault,
        unlock,
        lock,
        resetVault,
        encryptData,
        decryptData,
        decryptJSON
    };
}
