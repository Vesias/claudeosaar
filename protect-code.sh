#!/usr/bin/env bash
# ------------------------------------------------------------------------------
# ClaudeOSaar Steganographie-Schutz
# 
# Dieses Skript fügt versteckte Wasserzeichen in den Code ein, um die Herkunft
# nachweisen zu können, falls der Code ohne Erlaubnis verwendet wird.
# ------------------------------------------------------------------------------

set -e

# Farbdefinitionen
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}ClaudeOSaar Steganographie-Protektor${NC}"
echo -e "${YELLOW}Fügt versteckte Identifikatoren zu Codedateien hinzu${NC}"
echo ""

# Repository-Wurzelverzeichnis
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

# Zufällige Herausforderung generieren (wird Base64-kodiert eingefügt)
CHALLENGE_ID=$(head -c 8 /dev/urandom | base64)
OWNER_ID="JAN-CLAUDEOSAAR-$(date +%Y)"
ENCODED_OWNER=$(echo -n "$OWNER_ID" | base64)

# Funktion zum Einfügen von versteckten Wasserzeichen in JS/TS-Dateien
insert_js_ts_steganography() {
    local file=$1
    local temp_file=$(mktemp)
    
    # Überprüfen, ob die Datei bereits ein verstecktes Wasserzeichen hat
    if grep -q "\/\* ${OWNER_ID:0:3}" "$file"; then
        echo -e "${YELLOW}Überspringe${NC} $file (bereits mit verstecktem Wasserzeichen versehen)"
        return
    fi
    
    # Zeilenumbrüche im Quellcode zählen für die Position
    local line_count=$(wc -l < "$file")
    local insertion_line=$((line_count / 3))
    
    awk -v line="$insertion_line" -v owner="$ENCODED_OWNER" -v challenge="$CHALLENGE_ID" '
    NR == line {
        print "// @ts-ignore"
        print "const /* ' ${OWNER_ID:0:3}'-" challenge " */ _ = \"" owner "\"; // prettier-ignore"
        print $0
    }
    NR != line { print $0 }
    ' "$file" > "$temp_file"
    
    mv "$temp_file" "$file"
    echo -e "${GREEN}Verstecktes Wasserzeichen eingefügt in${NC} $file"
}

# Funktion zum Einfügen von versteckten Wasserzeichen in Python-Dateien
insert_py_steganography() {
    local file=$1
    local temp_file=$(mktemp)
    
    # Überprüfen, ob die Datei bereits ein verstecktes Wasserzeichen hat
    if grep -q "# ${OWNER_ID:0:3}" "$file"; then
        echo -e "${YELLOW}Überspringe${NC} $file (bereits mit verstecktem Wasserzeichen versehen)"
        return
    fi
    
    # Zeilenumbrüche im Quellcode zählen für die Position
    local line_count=$(wc -l < "$file")
    local insertion_line=$((line_count / 4))
    
    awk -v line="$insertion_line" -v owner="$ENCODED_OWNER" -v challenge="$CHALLENGE_ID" '
    NR == line {
        print "# ' ${OWNER_ID:0:3}'-" challenge
        print "_ = \"" owner "\"  # noqa"
        print $0
    }
    NR != line { print $0 }
    ' "$file" > "$temp_file"
    
    mv "$temp_file" "$file"
    echo -e "${GREEN}Verstecktes Wasserzeichen eingefügt in${NC} $file"
}

# Funktion zum Einfügen von versteckten Wasserzeichen in CSS-Dateien
insert_css_steganography() {
    local file=$1
    local temp_file=$(mktemp)
    
    # Überprüfen, ob die Datei bereits ein verstecktes Wasserzeichen hat
    if grep -q "/\* cldsaar-" "$file"; then
        echo -e "${YELLOW}Überspringe${NC} $file (bereits mit verstecktem Wasserzeichen versehen)"
        return
    fi
    
    awk -v owner="$ENCODED_OWNER" -v challenge="$CHALLENGE_ID" '
    BEGIN { inserted = 0 }
    /^[[:space:]]*\{/ && !inserted { 
        print $0;
        print "  /* cldsaar-" challenge " */ content: \"" owner "\"; /* DO NOT REMOVE */";
        inserted = 1;
        next;
    }
    { print $0 }
    ' "$file" > "$temp_file"
    
    mv "$temp_file" "$file"
    echo -e "${GREEN}Verstecktes Wasserzeichen eingefügt in${NC} $file"
}

process_steganography() {
    # TypeScript/JavaScript-Dateien
    echo -e "\n${BLUE}Verarbeite TypeScript/JavaScript-Dateien für Steganographie...${NC}"
    while IFS= read -r file; do
        insert_js_ts_steganography "$file"
    done < <(find ./src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
             -not -path "*/node_modules/*" \
             -not -path "*/\.*" \
             -not -path "*/dist/*" \
             -not -path "*/build/*" \
             | head -50)  # Beschränke auf die ersten 50 Dateien für bessere Performance
    
    # Python-Dateien
    echo -e "\n${BLUE}Verarbeite Python-Dateien für Steganographie...${NC}"
    while IFS= read -r file; do
        insert_py_steganography "$file"
    done < <(find ./src -type f -name "*.py" \
             -not -path "*/\.*" \
             -not -path "*/venv/*" \
             -not -path "*/__pycache__/*" \
             | head -50)  # Beschränke auf die ersten 50 Dateien für bessere Performance
    
    # CSS-Dateien
    echo -e "\n${BLUE}Verarbeite CSS-Dateien für Steganographie...${NC}"
    while IFS= read -r file; do
        insert_css_steganography "$file"
    done < <(find ./src -type f \( -name "*.css" -o -name "*.scss" -o -name "*.sass" \) \
             -not -path "*/node_modules/*" \
             -not -path "*/\.*" \
             -not -path "*/dist/*" \
             -not -path "*/build/*" \
             | head -20)  # Beschränke auf die ersten 20 Dateien für bessere Performance
}

# Hauptprozess starten
process_steganography

# Zusammenfassung ausgeben
echo -e "\n${BLUE}Versteckte Wasserzeichen (Steganographie) wurden hinzugefügt${NC}"
echo -e "${YELLOW}Challenge ID: ${NC}$CHALLENGE_ID"
echo -e "${YELLOW}Owner ID:     ${NC}$OWNER_ID"
echo -e "\n${RED}WICHTIG:${NC} Bewahren Sie diese IDs an einem sicheren Ort auf, um im Falle einer nicht autorisierten Nutzung die Herkunft des Codes nachweisen zu können."

# Erstellung einer Protokolldatei für die eingebetteten Wasserzeichen
WATERMARK_LOG="$REPO_ROOT/.watermark_log_$(date +%Y%m%d).txt"
{
    echo "ClaudeOSaar Wasserzeichen-Protokoll"
    echo "Erstellungsdatum: $(date)"
    echo "Challenge ID: $CHALLENGE_ID"
    echo "Owner ID: $OWNER_ID"
    echo "Encoded Owner ID: $ENCODED_OWNER"
    echo ""
    echo "Dieses Protokoll dient als Nachweis für eingebettete Wasserzeichen im Code."
    echo "Bewahren Sie diese Datei an einem sicheren Ort außerhalb des Repositories auf."
} > "$WATERMARK_LOG"

echo -e "\n${GREEN}Wasserzeichen-Protokoll wurde in ${WATERMARK_LOG} gespeichert${NC}"

# Git-Commit vorbereiten
echo -e "\n${BLUE}Möchten Sie die Änderungen zu Git hinzufügen und committen? (j/n)${NC}"
read -r response
if [[ "$response" =~ ^[Jj]$ ]]; then
    git add ./src
    git commit -m "Versteckte Identifikatoren zur Codeprotection hinzugefügt"
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

echo -e "\n${GREEN}Steganographie-Prozess abgeschlossen!${NC}"
