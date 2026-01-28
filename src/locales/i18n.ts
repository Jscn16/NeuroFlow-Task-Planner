export type Language = 'en' | 'de';

export interface Translations {
    header: {
        private: string;
        work: string;
        week: string;
        planner: string;
        focus: string;
        notes: string;
        habits: string;
        stats: string;
        priority: string;
        calendar: string;
    };
    deadlinePicker: {
        addDeadline: string;
        removeDeadline: string;
        today: string;
        tomorrow: string;
        nextWeek: string;
        overdue: string;
    };
    sidebar: {
        addNewTask: string;
        priority: string;
        high: string;
        medium: string;
        low: string;
        leisure: string;
        chores: string;
        backlog: string;
        duration: string;
        schedule: string;
        date: string;
        time: string;
        add: string;
        scheduleTask: string;
        scheduleBtn: string;
    };
    rows: {
        goal: { label: string; sub: string };
        focus: { label: string; sub: string };
        work: { label: string; sub: string };
        leisure: { label: string; sub: string };
        chores: { label: string; sub: string };
    };
    settings: {
        title: string;
        appearance: string;
        display: string;
        security: string;
        advanced: string;
        language: string;
        selectLanguage: string;
        theme: string;
        showCompleted: string;
        nightOwl: string;
        encryption: string;
        sync: string;
        logout: string;
        export: string;
        import: string;
        resetTour: string;
        deleteAll: string;
        min: string;
        hr: string;
        due: string;
        saveChanges: string;
        cancelEdit: string;
        subtasks: string;
        notesPlaceholder: string;
        done: string;
        spaces: {
            title: string;
            enable: string;
            desc: string;
            info: string;
        };
    };
}

export const translations: Record<Language, Translations> = {
    en: {
        header: {
            private: 'Private',
            work: 'Work',
            week: 'Week',
            planner: 'Planner',
            focus: 'Deep Focus',
            notes: 'Notes',
            habits: 'Habits',
            stats: 'Stats',
            priority: 'Priority',
            calendar: 'Calendar',
            lateNight: 'Late Night',
            openSidebar: 'Open Sidebar',
        },
        deadlinePicker: {
            addDeadline: 'Add deadline',
            removeDeadline: 'Remove deadline',
            today: 'Today',
            tomorrow: 'Tomorrow',
            nextWeek: 'Next week',
            overdue: 'Overdue',
        },
        sidebar: {
            addNewTask: 'Add new task...',
            priority: 'Priority / Category',
            high: 'High',
            medium: 'Medium',
            low: 'Low',
            leisure: 'Leisure',
            chores: 'Chores',
            backlog: 'Backlog',
            duration: 'Duration',
            schedule: 'Schedule (Optional)',
            date: 'Date',
            time: 'Time',
            add: '+ Add',
            delete: 'Delete',
            save: 'Save',
            cancel: 'Cancel',
            untitled: 'Untitled',
            stats: 'Stats',
            tasks: 'Tasks',
            scheduleTask: 'Schedule task',
            scheduleBtn: 'Schedule',
        },
        rows: {
            goal: { label: 'GOAL', sub: 'High impact' },
            focus: { label: 'FOCUS', sub: 'Deep work' },
            work: { label: 'WORK', sub: 'Business' },
            leisure: { label: 'LEISURE', sub: 'Recharge' },
            chores: { label: 'CHORES', sub: 'Life admin' },
        },
        settings: {
            title: 'Settings',
            appearance: 'Appearance',
            display: 'Display',
            security: 'Security',
            advanced: 'Advanced',
            language: 'Language',
            selectLanguage: 'Select Language',
            theme: 'Theme',
            showCompleted: 'Show Completed Tasks',
            nightOwl: 'Night Owl Mode',
            encryption: 'Encryption',
            sync: 'Supabase Sync',
            logout: 'Logout',
            export: 'Export Data',
            import: 'Import Data',
            resetTour: 'Reset Tour',
            deleteAll: 'Delete All Tasks',
            themeSubtitle: 'Customize your workspace',
            showCompletedSubtitle: 'Always keep them visible',
            nightOwlSubtitle: 'Shift your day\'s start time. Tasks done before this time count as "yesterday".',
            nightOwlLabel: 'Enable Night Owl Mode',
            nightOwlTime: 'Day ends at',
            encryptionSubtitle: 'Protect your data with a master password.',
            data: 'Data Management',
            dataSubtitle: 'Export, import and sync your data',
            help: 'Help',
            helpSubtitle: 'Guides and feedback',
            advancedSubtitle: 'Dangerous territory',
            show: 'Show',
            fade: 'Fade',
            hide: 'Hide',
            encryptionActive: 'Encryption enabled',
            encryptionDisabled: 'End-to-end encryption',
            encryptionDescActive: 'Your data is encrypted with your passphrase. Only you can read it.',
            encryptionDescDisabled: 'Encrypt your data with a passphrase. No one (including us) can read your data.',
            enable: 'Enable',
            disable: 'Disable',
            activeStatus: 'Active',
            passphraseWarning: 'If you forget your passphrase, your data cannot be recovered.',
            cloudSyncEnabled: 'Cloud sync enabled',
            localOnly: 'Local only',
            signOut: 'Sign Out',
            signOutConfirm: 'Sign out of your account? Your data will stay synced.',
            dataSync: 'Data & Sync',
            deleteAllWarn: 'Type SURE to delete ALL data. This cannot be undone.',
            deleteAllCancel: 'Deletion cancelled. Type SURE (all caps) to confirm.',
            resetStatsConfirm: 'Reset all progress (completed tasks)? This will un-complete all tasks but NOT delete them.',
            resetStatsBtn: 'Reset All Progress (Stats)',
            deleteAllBtn: 'Delete All Data',
            habitsTitle: 'Habit Tracker',
            habitsSubtitle: 'Build consistent routines',
            notesTitle: 'Brain Dump',
            notesSubtitle: 'Clear your mind, capture everything',
            analyticsTitle: 'Analytics',
            analyticsSubtitle: 'Your productivity insights',
            focusTitle: 'Deep Focus',
            focusSubtitle: 'Stay in the flow',
            min: 'min',
            hr: 'h',
            due: 'Due',
            saveChanges: 'Save changes',
            cancelEdit: 'Cancel editing',
            deleteTask: 'Delete task',
            addSubtask: 'Add a subtask...',
            subtasks: 'Subtasks',
            notesPlaceholder: 'Add details, notes or links...',
            done: 'done',
            focusMode: {
                todayTotal: 'Today total',
                pomodoroStyle: 'Pomodoro-style work cycles: structured focus blocks and short recovery breaks.',
                upNext: 'Up Next',
                sessionStatus: 'Session Status',
                currentState: 'Current State',
                running: 'Running',
                paused: 'Paused',
                idle: 'Idle',
                pause: 'Pause',
                resume: 'Resume',
                stop: 'Stop',
                taskDetails: 'Task Details',
                title: 'Title',
                type: 'Type',
                est: 'Est.',
                notes: 'Notes',
                todaysLoad: "Today's Load",
                totalTasks: 'Total Tasks',
                totalTime: 'Total Time',
                readyToFocus: 'Ready to focus?',
                pickTask: 'Pick a task below to start a deep work session',
                focusPhase: 'Focus Phase',
                breakPhase: 'Break Phase',
                deepWork: 'Deep Work',
                brainBreak: 'Brain Break',
                markDone: 'Mark Done',
            },
            brainDump: {
                title: 'Notes',
                subtitle: 'Capture your thoughts. Multiple lists supported.',
                deleteListConfirm: 'Delete this list?',
                typeAnything: 'Type anything...',
                newList: 'New List',
            },
            habitTracker: {
                title: 'Habit Tracker',
                subtitle: 'Track and reinforce your routines',
                habit: 'Habit',
                progress: 'Progress',
                streak: 'Streak',
                streakWeek: 'this week',
                newHabitName: 'New Habit Name',
                example: 'e.g. Gym, Reading...',
                weeklyGoal: 'Weekly Goal',
                days: 'days',
                add: 'Add',
                scheduleHabit: 'Schedule Habit',
                scheduleTimeOptional: 'Schedule Time (Optional)',
                addToPlanner: 'Add to Planner',
                today: 'Today',
            },
            analytics: {
                title: 'Productivity Insights',
                level: 'Level',
                flowScore: 'Flow Score',
                flowScoreTooltip: 'Share of high-value tasks (high/medium priority) vs all completed tasks.',
                deepVsShallow: 'Deep vs Shallow Ratio',
                dailyCapacity: 'Daily Capacity',
                overCapacity: '⚠️ Over capacity!',
                nearLimit: '⚡ Near limit',
                healthy: '✅ Healthy',
                dayStreak: 'Day Streak',
                todayDone: 'Today Done',
                weekProgress: "This Week's Progress",
                personalBests: 'Personal Bests',
                tasksInDay: 'Tasks in a day',
                hoursInDay: 'Hours in a day',
                longestTask: 'Longest task',
                tasksCrushed: 'Tasks Crushed',
                deepWork: 'Deep Work',
                highPriority: 'High Priority',
                productivity: 'Productivity',
                completedByCategory: 'Completed by Category',
                motivational: {
                    perfect: "🎉 Perfect day! You crushed it!",
                    fire: "🔥 On fire! Almost there!",
                    halfway: "💪 Halfway done, keep pushing!",
                    streak: "🌟 Incredible streak! Don't break it!",
                    default: "🚀 Let's make today count!"
                }
            },
            spaces: {
                title: 'Work / Private Mode',
                enable: 'Enable Work Space',
                desc: 'Separates tasks and entries into Work and Private spaces.',
                info: 'You are currently in {mode} mode. Use the switcher in the header to toggle between spaces.',
            },
        },
    },
    de: {
        header: {
            private: 'Privat',
            work: 'Arbeit',
            week: 'Woche',
            planner: 'Planer',
            focus: 'Deep Focus',
            notes: 'Notizen',
            habits: 'Gewohnheiten',
            stats: 'Statistiken',
            priority: 'Priorität',
            calendar: 'Kalender',
            lateNight: 'Spätschicht',
            openSidebar: 'Sidebar öffnen',
        },
        deadlinePicker: {
            addDeadline: 'Frist hinzufügen',
            removeDeadline: 'Frist entfernen',
            today: 'Heute',
            tomorrow: 'Morgen',
            nextWeek: 'Nächste Woche',
            overdue: 'Überfällig',
        },
        sidebar: {
            addNewTask: 'Neue Aufgabe hinzufügen...',
            priority: 'Priorität / Kategorie',
            high: 'Priorität',
            medium: 'Mittel',
            low: 'Niedrig',
            leisure: 'Entspannung',
            chores: 'Hausarbeit',
            backlog: 'Backlog',
            duration: 'Dauer',
            schedule: 'Planen (Optional)',
            date: 'Datum',
            time: 'Uhrzeit',
            add: '+ Hinzufügen',
            delete: 'Löschen',
            save: 'Speichern',
            cancel: 'Abbrechen',
            untitled: 'Unbenannt',
            stats: 'Statistiken',
            tasks: 'Aufgaben',
            scheduleTask: 'Aufgabe planen',
            scheduleBtn: 'Planen',
        },
        rows: {
            goal: { label: 'ZIEL', sub: 'High Impact' },
            focus: { label: 'FOKUS', sub: 'Deep Work' },
            work: { label: 'ARBEIT', sub: 'Business' },
            leisure: { label: 'FREIZEIT', sub: 'Erholen' },
            chores: { label: 'HAUSARBEIT', sub: 'Basics' },
        },
        settings: {
            title: 'Einstellungen',
            appearance: 'Erscheinungsbild',
            display: 'Anzeige',
            security: 'Sicherheit',
            advanced: 'Erweitert',
            language: 'Sprache',
            selectLanguage: 'Sprache wählen',
            theme: 'Farbschema',
            showCompleted: 'Erledigte Aufgaben anzeigen',
            nightOwl: 'Nachteulen-Modus',
            encryption: 'Verschlüsselung',
            sync: 'Supabase Sync',
            logout: 'Abmelden',
            export: 'Daten exportieren',
            import: 'Daten importieren',
            resetTour: 'Tour zurücksetzen',
            deleteAll: 'Alle Aufgaben löschen',
            themeSubtitle: 'Personalisiere deinen Arbeitsbereich',
            showCompletedSubtitle: 'Immer sichtbar lassen',
            nightOwlSubtitle: 'Verschiebe den Tagesbeginn. Aufgaben vor dieser Zeit zählen als "gestern".',
            nightOwlLabel: 'Nachteulen-Modus aktivieren',
            nightOwlTime: 'Tag endet um',
            encryptionSubtitle: 'Schütze deine Daten mit einem Master-Passwort.',
            data: 'Datenverwaltung',
            dataSubtitle: 'Exportieren, Importieren und Synchronisieren',
            help: 'Hilfe',
            helpSubtitle: 'Anleitungen und Feedback',
            advancedSubtitle: 'Gefahrenzone',
            show: 'Sichtbar',
            fade: 'Verblasst',
            hide: 'Versteckt',
            encryptionActive: 'Verschlüsselung aktiviert',
            encryptionDisabled: 'Ende-zu-Ende Verschlüsselung',
            encryptionDescActive: 'Deine Daten sind mit deinem Passphrase verschlüsselt. Nur du kannst sie lesen.',
            encryptionDescDisabled: 'Verschlüssele deine Daten mit einem Passphrase. Niemand (auch wir nicht) kann deine Daten lesen.',
            enable: 'Aktivieren',
            disable: 'Deaktivieren',
            activeStatus: 'Aktiv',
            passphraseWarning: 'Wenn du dein Passphrase vergisst, können deine Daten nicht wiederhergestellt werden.',
            cloudSyncEnabled: 'Cloud-Sync aktiviert',
            localOnly: 'Nur lokal',
            signOut: 'Abmelden',
            signOutConfirm: 'Abmelden? Deine Daten bleiben synchronisiert.',
            dataSync: 'Daten & Sync',
            deleteAllWarn: 'Gib SICHER ein, um ALLE Daten zu löschen. Dies kann nicht rückgängig gemacht werden.',
            deleteAllCancel: 'Löschen abgebrochen. Gib SICHER ein, um zu bestätigen.',
            resetStatsConfirm: 'Alle Fortschritte zurücksetzen (erledigte Aufgaben)? Dies setzt alle Aufgaben auf "nicht erledigt", löscht sie aber NICHT.',
            resetStatsBtn: 'Alle Statistiken zurücksetzen',
            deleteAllBtn: 'Alle Daten löschen',
            habitsTitle: 'Habit-Tracker',
            habitsSubtitle: 'Beständige Routinen aufbauen',
            notesTitle: 'Brain Dump',
            notesSubtitle: 'Kopf frei bekommen, alles festhalten',
            analyticsTitle: 'Analyse',
            analyticsSubtitle: 'Deine Produktivitäts-Einblicke',
            focusTitle: 'Deep Focus',
            focusSubtitle: 'Bleib im Flow',
            min: 'Min',
            hr: 'Std.',
            due: 'Fällig am',
            saveChanges: 'Änderungen speichern',
            cancelEdit: 'Bearbeiten abbrechen',
            deleteTask: 'Aufgabe löschen',
            addSubtask: 'Füge eine Unteraufgabe hinzu...',
            subtasks: 'Unteraufgaben',
            notesPlaceholder: 'Füge weitere Details, Notizen oder Links hinzu...',
            done: 'erledigt',
            focusMode: {
                todayTotal: 'Heute gesamt',
                pomodoroStyle: 'Pomodoro-Arbeitszyklen: strukturierte Fokusblöcke und kurze Pausen.',
                upNext: 'Als nächstes',
                sessionStatus: 'Sitzungsstatus',
                currentState: 'Aktueller Status',
                running: 'Läuft',
                paused: 'Pausiert',
                idle: 'Leerlauf',
                pause: 'Pause',
                resume: 'Fortsetzen',
                stop: 'Stopp',
                taskDetails: 'Aufgabendetails',
                title: 'Titel',
                type: 'Typ',
                est: 'Geschätzt',
                notes: 'Notizen',
                todaysLoad: "Heutige Auslastung",
                totalTasks: 'Aufgaben gesamt',
                totalTime: 'Zeit gesamt',
                readyToFocus: 'Bereit für Fokus?',
                pickTask: 'Wähle eine Aufgabe, um eine Deep-Work-Sitzung zu starten',
                focusPhase: 'Fokusphase',
                breakPhase: 'Pausephase',
                deepWork: 'Deep Work',
                brainBreak: 'Gehirnpause',
                markDone: 'Als erledigt markieren',
            },
            brainDump: {
                title: 'Notizen',
                subtitle: 'Halte deine Gedanken fest. Mehrere Listen unterstützt.',
                deleteListConfirm: 'Diese Liste löschen?',
                typeAnything: 'Schreibe etwas...',
                newList: 'Neue Liste',
            },
            habitTracker: {
                title: 'Gewohnheitstracker',
                subtitle: 'Verfolge und festige deine Routinen',
                habit: 'Gewohnheit',
                progress: 'Fortschritt',
                streak: 'Streak',
                streakWeek: 'diese Woche',
                newHabitName: 'Name der Gewohnheit',
                example: 'z.B. Fitnessstudio, Lesen...',
                weeklyGoal: 'Wochenziel',
                days: 'Tage',
                add: 'Hinzufügen',
                scheduleHabit: 'Gewohnheit planen',
                scheduleTimeOptional: 'Zeit planen (Optional)',
                addToPlanner: 'Zum Planer hinzufügen',
                today: 'Heute',
            },
            analytics: {
                title: 'Produktivitäts-Einblicke',
                level: 'Level',
                flowScore: 'Flow Score',
                flowScoreTooltip: 'Anteil hochwertiger Aufgaben (hohe/mittlere Priorität) an allen erledigten Aufgaben.',
                deepVsShallow: 'Deep vs Shallow Verhältnis',
                dailyCapacity: 'Tägliche Kapazität',
                overCapacity: '⚠️ Überlastet!',
                nearLimit: '⚡ Am Limit',
                healthy: '✅ Gesund',
                dayStreak: 'Tages-Streak',
                todayDone: 'Heute erledigt',
                weekProgress: "Fortschritt diese Woche",
                personalBests: 'Persönliche Bestleistungen',
                tasksInDay: 'Aufgaben an einem Tag',
                hoursInDay: 'Stunden an einem Tag',
                longestTask: 'Längste Aufgabe',
                tasksCrushed: 'Aufgaben erledigt',
                deepWork: 'Deep Work',
                highPriority: 'Hohe Priorität',
                productivity: 'Produktivität',
                completedByCategory: 'Erledigt nach Kategorie',
                motivational: {
                    perfect: "🎉 Perfekter Tag! Du hast es gerockt!",
                    fire: "🔥 Du brennst! Fast geschafft!",
                    halfway: "💪 Hälfte geschafft, weiter so!",
                    streak: "🌟 Unglaublicher Streak! Nicht abreißen lassen!",
                    default: "🚀 Mach den heutigen Tag zählen!"
                }
            },
            spaces: {
                title: 'Arbeit / Privat Modus',
                enable: 'Arbeitsbereich aktivieren',
                desc: 'Trennt Aufgaben und Einträge in Arbeits- und Privatbereiche.',
                info: 'Du befindest dich derzeit im {mode}-Modus. Nutze den Umschalter in der Kopfzeile, um zu wechseln.',
            },
        },
    },
};
