import fs from 'fs';
import path from 'path';

function cleanConsoleFromFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Supprimer les console.log
        const logPattern = /\s*console\.log\([^;]*\);?\s*\n?/g;
        if (logPattern.test(content)) {
            content = content.replace(logPattern, '');
            modified = true;
        }

        // Remplacer console.error par des commentaires simples
        const errorPattern = /console\.error\([^)]*\)/g;
        if (errorPattern.test(content)) {
            content = content.replace(errorPattern, '// Erreur gérée silencieusement');
            modified = true;
        }

        // Supprimer console.warn
        const warnPattern = /\s*console\.warn\([^;]*\);?\s*\n?/g;
        if (warnPattern.test(content)) {
            content = content.replace(warnPattern, '');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`Nettoyé: ${filePath}`);
        }
    } catch (error) {
        console.error(`Erreur lors du nettoyage de ${filePath}:`, error.message);
    }
}

function walkDir(dir, callback) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            walkDir(filePath, callback);
        } else if (file.endsWith('.vue') || file.endsWith('.ts')) {
            callback(filePath);
        }
    });
}

// Nettoyer le dossier src
walkDir('./src', cleanConsoleFromFile);
console.log('Nettoyage terminé!');
