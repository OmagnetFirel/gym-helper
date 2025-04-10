import {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button.tsx";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
}


const InstallButton: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstall, setShowInstall] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;
            if (result.outcome === 'accepted') {
                console.log('App instalado com sucesso!');
            } else {
                console.log('Usuário recusou a instalação.');
            }
            setDeferredPrompt(null);
            setShowInstall(false);
        }
    };

    return showInstall ? (
        <Button variant="outline" onClick={handleInstallClick}
                className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 transition-all"
        >
            Instalar App
        </Button>
    ) : null;
};

export default InstallButton;

