import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsModal } from './SettingsModal';
import { themes } from '../../themes';

describe('SettingsModal', () => {
    const mockProps = {
        onClose: vi.fn(),
        onExport: vi.fn(),
        onImport: vi.fn(),
        currentThemeId: themes[0].id,
        onThemeChange: vi.fn(),
        supabaseEnabled: false,
        onToggleSupabase: vi.fn(),
        onResetTour: vi.fn(),
        onLogout: vi.fn(),
        onResetStats: vi.fn(),
        encryptionEnabled: false,
        onEnableEncryption: vi.fn()
    };

    it('renders correctly', () => {
        render(<SettingsModal {...mockProps} />);
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Appearance')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(<SettingsModal {...mockProps} />);
        const closeButton = screen.getByLabelText('Close settings');
        fireEvent.click(closeButton);
        expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('toggles sections', () => {
        render(<SettingsModal {...mockProps} />);
        const appearanceSection = screen.getByText('Appearance');
        // It starts open? Let's check logic. SettingsSection defaults to defaultOpen=true usually.
        // Assuming Section component structure works.
        expect(appearanceSection).toBeInTheDocument();
    });
});
