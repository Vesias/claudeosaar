#!/usr/bin/env bash
# ------------------------------------------------------------------------------
# ClaudeOSaar Sensible Daten Schutz
# 
# Dieses Skript entfernt sensible Daten aus dem Repository vor dem Pushen zu GitHub
# ------------------------------------------------------------------------------

set -e

# Farbdefinitionen
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}ClaudeOSaar Sensible Daten Schutz${NC}"
echo -e "${YELLOW}Entfernt sensible Daten vor dem Pushen zu GitHub${NC}"
echo ""

# Repository-Wurzelverzeichnis
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

# Funktion zur Sicherung von .env-Dateien
backup_env_files() {
    local backup_dir="$REPO_ROOT/.env_backups"
    mkdir -p "$backup_dir"
    
    find "$REPO_ROOT" -type f -name ".env*" | while read -r env_file; do
        local rel_path="${env_file#$REPO_ROOT/}"
        local backup_path="$backup_dir/${rel_path//\//_}_$(date +%Y%m%d%H%M%S)"
        
        echo -e "${YELLOW}Sicherung von${NC} $rel_path ${YELLOW}nach${NC} $backup_path"
        cp "$env_file" "$backup_path"
    done
}

# Funktion zum Bereinigen von .env-Dateien
clean_env_files() {
    local env_template="$REPO_ROOT/.env.example"
    
    # Erstellen einer Vorlage, falls sie nicht existiert
    if [[ ! -f "$env_template" ]]; then
        echo -e "${YELLOW}Erstelle .env.example-Vorlage${NC}"
        {
            echo "# ClaudeOSaar Umgebungsvariablen"
            echo "# Erstellen Sie eine .env-Datei basierend auf dieser Vorlage"
            echo ""
            echo "# API Konfiguration"
            echo "API_PORT=3333"
            echo "API_HOST=localhost"
            echo "NODE_ENV=development"
            echo ""
            echo "# Datenbank"
            echo "DATABASE_URL=postgresql://user:password@localhost:5432/claudeosaar"
            echo ""
            echo "# JWT"
            echo "JWT_SECRET=your_jwt_secret_here"
            echo "JWT_EXPIRY=24h"
            echo ""
            echo "# Claude API"
            echo "CLAUDE_API_KEY=your_claude_api_key_here"
            echo ""
            echo "# E-Mail"
            echo "SMTP_HOST=smtp.example.com"
            echo "SMTP_PORT=587"
            echo "SMTP_USER=your_smtp_user"
            echo "SMTP_PASS=your_smtp_password"
            echo ""
            echo "# Zahlungen"
            echo "STRIPE_SECRET_KEY=your_stripe_secret_key_here"
            echo "STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here"
            echo "STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here"
        } > "$env_template"
    fi
    
    # Alle .env-Dateien finden und anonymisieren
    find "$REPO_ROOT" -type f -name ".env*" -not -name ".env.example" | while read -r env_file; do
        local rel_path="${env_file#$REPO_ROOT/}"
        
        # .env.example erstellen, wenn die Datei noch nicht existiert
        if [[ "$env_file" != *".env.example"* && ! -f "${env_file}.example" ]]; then
            cp "$env_file" "${env_file}.example"
            sed -i 's/\(.*=\).*/\1YOUR_VALUE_HERE/' "${env_file}.example"
            echo -e "${GREEN}Beispieldatei erstellt:${NC} ${env_file}.example"
        fi
        
        # Entferne .env-Dateien aus dem Git-Index (ohne sie zu löschen)
        git rm --cached "$env_file" 2>/dev/null || true
        echo -e "${GREEN}Entfernt aus Git-Index:${NC} $rel_path"
    done
}

# Suche nach API-Keys und anderen Geheimnissen
find_secrets() {
    echo -e "\n${BLUE}Suche nach potenziellen API-Schlüsseln und Geheimnissen...${NC}"
    
    # Muster für typische API-Schlüssel und Geheimnisse
    local patterns=(
        "api[_-]key"
        "apikey"
        "secret"
        "password"
        "pass"
        "token"
        "auth"
        "credential"
        "sk_live_"
        "pk_live_"
        "access_key"
    )
    
    for pattern in "${patterns[@]}"; do
        echo -e "\n${YELLOW}Suche nach: ${pattern}${NC}"
        git grep -i "$pattern" -- ":(exclude)*.sh" ":(exclude)protect-code.sh" ":(exclude)add-watermark.sh" ":(exclude).env*" || echo -e "${GREEN}Keine Treffer für: $pattern${NC}"
    done
}

# Aktualisiere .gitignore
update_gitignore() {
    local gitignore="$REPO_ROOT/.gitignore"
    
    # Erstelle .gitignore, wenn es nicht existiert
    if [[ ! -f "$gitignore" ]]; then
        echo -e "${YELLOW}Erstelle .gitignore-Datei${NC}"
        touch "$gitignore"
    fi
    
    # Liste von Mustern, die in .gitignore sein sollten
    local patterns=(
        "# Umgebungsvariablen und Geheimnisse"
        ".env"
        ".env.*"
        "!.env.example"
        ""
        "# Wasserzeichen-Logs"
        ".watermark_log_*"
        ""
        "# Temporäre Dateien"
        "*.tmp"
        "*.temp"
        "*.log"
        ""
        "# Build-Output"
        "dist/"
        "build/"
        ""
        "# Abhängigkeiten"
        "node_modules/"
        "__pycache__/"
        "*.pyc"
        ""
        "# IDE und Editor-Dateien"
        ".idea/"
        ".vscode/"
        "*.swp"
        "*.swo"
        ""
        "# Betriebssystem-Dateien"
        ".DS_Store"
        "Thumbs.db"
        ""
    )
    
    # Für jedes Muster prüfen, ob es bereits in .gitignore ist
    for pattern in "${patterns[@]}"; do
        if ! grep -qF "$pattern" "$gitignore"; then
            echo "$pattern" >> "$gitignore"
        fi
    done
    
    echo -e "${GREEN}.gitignore wurde aktualisiert${NC}"
}

# Führe alle Funktionen aus
echo -e "${BLUE}Starte Sicherung von .env-Dateien...${NC}"
backup_env_files

echo -e "\n${BLUE}Bereinige .env-Dateien...${NC}"
clean_env_files

echo -e "\n${BLUE}Aktualisiere .gitignore...${NC}"
update_gitignore

echo -e "\n${BLUE}Suche nach potenziell sensiblen Daten...${NC}"
find_secrets

echo -e "\n${GREEN}Sensible Daten wurden gesichert und aus dem Git-Repository entfernt.${NC}"
echo -e "${YELLOW}Vergessen Sie nicht, diese Änderungen zu committen und zu pushen.${NC}"

echo -e "\n${BLUE}Möchten Sie die Änderungen committen? (j/n)${NC}"
read -r response
if [[ "$response" =~ ^[Jj]$ ]]; then
    git add .gitignore
    git commit -m "Aktualisierte .gitignore für verbesserte Sicherheit"
    echo -e "${GREEN}Änderungen wurden erfolgreich committiert${NC}"
    
    echo -e "\n${BLUE}Möchten Sie die Änderungen zu GitHub pushen? (j/n)${NC}"
    read -r push_response
    if [[ "$push_response" =~ ^[Jj]$ ]]; then
        git push
        echo -e "${GREEN}Änderungen wurden erfolgreich zu GitHub gepusht${NC}"
    fi
else
    echo -e "${YELLOW}Änderungen wurden nicht zu Git hinzugefügt${NC}"
fi

echo -e "\n${GREEN}Prozess abgeschlossen!${NC}"
