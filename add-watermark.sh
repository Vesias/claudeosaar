#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# ClaudeOSaar Watermark Generator
# Dieses Skript fügt Wasserzeichen zu allen Codedateien im Repository hinzu
# -----------------------------------------------------------------------------

set -e

# Farbdefinitionen
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}ClaudeOSaar Wasserzeichen-Generator${NC}"
echo -e "${YELLOW}Fügt proprietäre Wasserzeichen zu Codedateien hinzu${NC}"
echo ""

# Repository-Wurzelverzeichnis
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

# Aktuelle Datumsangabe
CURRENT_DATE=$(date +"%d.%m.%Y")

# Wasserzeichen für verschiedene Dateitypen
JS_TS_WATERMARK="/**
 * PROPRIETÄRER CODE - CLAUDEOSAAR
 * 
 * © $(date +%Y) Jan. Alle Rechte vorbehalten.
 * 
 * Dieser Code ist urheberrechtlich geschützt und darf nicht ohne ausdrückliche
 * Genehmigung kopiert, modifiziert oder in abgeleiteten Werken verwendet werden.
 * 
 * Datum: ${CURRENT_DATE}
 * Projekt: ClaudeOSaar
 * Version: 2.2.0
 */
"

PYTHON_WATERMARK="# ------------------------------------------------------------------------------
# PROPRIETÄRER CODE - CLAUDEOSAAR
# 
# © $(date +%Y) Jan. Alle Rechte vorbehalten.
# 
# Dieser Code ist urheberrechtlich geschützt und darf nicht ohne ausdrückliche
# Genehmigung kopiert, modifiziert oder in abgeleiteten Werken verwendet werden.
# 
# Datum: ${CURRENT_DATE}
# Projekt: ClaudeOSaar
# Version: 2.2.0
# ------------------------------------------------------------------------------
"

HTML_WATERMARK="<!--
  PROPRIETÄRER CODE - CLAUDEOSAAR
  
  © $(date +%Y) Jan. Alle Rechte vorbehalten.
  
  Dieser Code ist urheberrechtlich geschützt und darf nicht ohne ausdrückliche
  Genehmigung kopiert, modifiziert oder in abgeleiteten Werken verwendet werden.
  
  Datum: ${CURRENT_DATE}
  Projekt: ClaudeOSaar
  Version: 2.2.0
-->
"

CSS_WATERMARK="/**
 * PROPRIETÄRER CODE - CLAUDEOSAAR
 * 
 * © $(date +%Y) Jan. Alle Rechte vorbehalten.
 * 
 * Dieser Code ist urheberrechtlich geschützt und darf nicht ohne ausdrückliche
 * Genehmigung kopiert, modifiziert oder in abgeleiteten Werken verwendet werden.
 * 
 * Datum: ${CURRENT_DATE}
 * Projekt: ClaudeOSaar
 * Version: 2.2.0
 */
"

SHELL_WATERMARK="#!/usr/bin/env bash
# ------------------------------------------------------------------------------
# PROPRIETÄRER CODE - CLAUDEOSAAR
# 
# © $(date +%Y) Jan. Alle Rechte vorbehalten.
# 
# Dieser Code ist urheberrechtlich geschützt und darf nicht ohne ausdrückliche
# Genehmigung kopiert, modifiziert oder in abgeleiteten Werken verwendet werden.
# 
# Datum: ${CURRENT_DATE}
# Projekt: ClaudeOSaar
# Version: 2.2.0
# ------------------------------------------------------------------------------
"

# Zähler für modifizierte Dateien
MODIFIED_COUNT=0
SKIPPED_COUNT=0
TOTAL_COUNT=0

# Funktion zum Hinzufügen von Wasserzeichen
add_watermark() {
    local file=$1
    local watermark=$2
    local temp_file=$(mktemp)
    
    # Überprüfen, ob die Datei bereits ein Wasserzeichen hat
    if grep -q "PROPRIETÄRER CODE - CLAUDEOSAAR" "$file"; then
        echo -e "${YELLOW}Überspringe${NC} $file (bereits mit Wasserzeichen versehen)"
        ((SKIPPED_COUNT++))
        return
    fi
    
    # Originale Dateirechte speichern
    local file_permissions=$(stat -c %a "$file")
    
    # Wasserzeichen hinzufügen
    echo -e "$watermark" > "$temp_file"
    cat "$file" >> "$temp_file"
    mv "$temp_file" "$file"
    
    # Originale Dateirechte wiederherstellen
    chmod "$file_permissions" "$file"
    
    echo -e "${GREEN}Wasserzeichen hinzugefügt zu${NC} $file"
    ((MODIFIED_COUNT++))
}

process_files() {
    # TypeScript/JavaScript-Dateien
    echo -e "\n${BLUE}Verarbeite TypeScript/JavaScript-Dateien...${NC}"
    while IFS= read -r file; do
        ((TOTAL_COUNT++))
        add_watermark "$file" "$JS_TS_WATERMARK"
    done < <(find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
             -not -path "*/node_modules/*" \
             -not -path "*/\.*" \
             -not -path "*/dist/*" \
             -not -path "*/build/*")
    
    # Python-Dateien
    echo -e "\n${BLUE}Verarbeite Python-Dateien...${NC}"
    while IFS= read -r file; do
        ((TOTAL_COUNT++))
        add_watermark "$file" "$PYTHON_WATERMARK"
    done < <(find . -type f -name "*.py" \
             -not -path "*/\.*" \
             -not -path "*/venv/*" \
             -not -path "*/__pycache__/*")
    
    # HTML-Dateien
    echo -e "\n${BLUE}Verarbeite HTML-Dateien...${NC}"
    while IFS= read -r file; do
        ((TOTAL_COUNT++))
        add_watermark "$file" "$HTML_WATERMARK"
    done < <(find . -type f -name "*.html" \
             -not -path "*/node_modules/*" \
             -not -path "*/\.*" \
             -not -path "*/dist/*" \
             -not -path "*/build/*")
    
    # CSS-Dateien
    echo -e "\n${BLUE}Verarbeite CSS-Dateien...${NC}"
    while IFS= read -r file; do
        ((TOTAL_COUNT++))
        add_watermark "$file" "$CSS_WATERMARK"
    done < <(find . -type f \( -name "*.css" -o -name "*.scss" -o -name "*.sass" \) \
             -not -path "*/node_modules/*" \
             -not -path "*/\.*" \
             -not -path "*/dist/*" \
             -not -path "*/build/*")
    
    # Shell-Skript-Dateien
    echo -e "\n${BLUE}Verarbeite Shell-Skript-Dateien...${NC}"
    while IFS= read -r file; do
        ((TOTAL_COUNT++))
        add_watermark "$file" "$SHELL_WATERMARK"
    done < <(find . -type f \( -name "*.sh" -o -name "*.bash" \) \
             -not -path "*/\.*" \
             -not -path "*/add-watermark.sh")
}

# Hauptprozess starten
process_files

# Zusammenfassung ausgeben
echo -e "\n${BLUE}Zusammenfassung:${NC}"
echo -e "${GREEN}$MODIFIED_COUNT${NC} Dateien mit Wasserzeichen versehen"
echo -e "${YELLOW}$SKIPPED_COUNT${NC} Dateien übersprungen (bereits mit Wasserzeichen)"
echo -e "Gesamt: ${BLUE}$TOTAL_COUNT${NC} Dateien verarbeitet"

# Git-Commit vorbereiten
echo -e "\n${BLUE}Möchten Sie die Änderungen zu Git hinzufügen und committen? (j/n)${NC}"
read -r response
if [[ "$response" =~ ^[Jj]$ ]]; then
    git add .
    git commit -m "Wasserzeichen zu allen Codedateien hinzugefügt"
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

echo -e "\n${GREEN}Wasserzeichen-Prozess abgeschlossen!${NC}"