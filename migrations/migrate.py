#!/usr/bin/env python3
"""Database migration tool for ClaudeOSaar"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
import sys
from datetime import datetime
from pathlib import Path

class DatabaseMigration:
    def __init__(self, database_url: str):
        self.conn = psycopg2.connect(database_url)
        self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)
        self.migrations_dir = Path(__file__).parent
        
    def create_migrations_table(self):
        """Create migrations tracking table"""
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) UNIQUE NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        self.conn.commit()
    
    def get_applied_migrations(self):
        """Get list of already applied migrations"""
        self.cursor.execute("SELECT filename FROM migrations ORDER BY filename")
        return {row['filename'] for row in self.cursor.fetchall()}
    
    def get_pending_migrations(self):
        """Get list of pending migrations"""
        applied = self.get_applied_migrations()
        all_migrations = sorted([
            f for f in os.listdir(self.migrations_dir)
            if f.endswith('.sql') and f not in applied
        ])
        return all_migrations
    
    def apply_migration(self, filename: str):
        """Apply a single migration"""
        filepath = self.migrations_dir / filename
        print(f"Applying migration: {filename}")
        
        try:
            with open(filepath, 'r') as f:
                migration_sql = f.read()
            
            # Execute migration
            self.cursor.execute(migration_sql)
            
            # Record migration
            self.cursor.execute(
                "INSERT INTO migrations (filename) VALUES (%s)",
                (filename,)
            )
            
            self.conn.commit()
            print(f"✓ Applied: {filename}")
            
        except Exception as e:
            self.conn.rollback()
            print(f"✗ Failed: {filename}")
            print(f"Error: {e}")
            raise
    
    def run_migrations(self):
        """Run all pending migrations"""
        self.create_migrations_table()
        
        pending = self.get_pending_migrations()
        
        if not pending:
            print("No pending migrations")
            return
        
        print(f"Found {len(pending)} pending migrations:")
        for migration in pending:
            print(f"  - {migration}")
        
        print("\nApplying migrations...")
        
        for migration in pending:
            self.apply_migration(migration)
        
        print(f"\n✓ Successfully applied {len(pending)} migrations")
    
    def rollback_migration(self, filename: str):
        """Rollback a specific migration (if rollback script exists)"""
        rollback_file = self.migrations_dir / f"rollback_{filename}"
        
        if not rollback_file.exists():
            print(f"No rollback script found for {filename}")
            return
        
        print(f"Rolling back migration: {filename}")
        
        try:
            with open(rollback_file, 'r') as f:
                rollback_sql = f.read()
            
            self.cursor.execute(rollback_sql)
            self.cursor.execute(
                "DELETE FROM migrations WHERE filename = %s",
                (filename,)
            )
            
            self.conn.commit()
            print(f"✓ Rolled back: {filename}")
            
        except Exception as e:
            self.conn.rollback()
            print(f"✗ Rollback failed: {filename}")
            print(f"Error: {e}")
            raise
    
    def status(self):
        """Show migration status"""
        self.create_migrations_table()
        
        applied = self.get_applied_migrations()
        pending = self.get_pending_migrations()
        
        print("Migration Status:")
        print(f"Applied: {len(applied)}")
        print(f"Pending: {len(pending)}")
        
        if applied:
            print("\nApplied migrations:")
            for migration in sorted(applied):
                print(f"  ✓ {migration}")
        
        if pending:
            print("\nPending migrations:")
            for migration in pending:
                print(f"  - {migration}")

def main():
    """Main CLI interface"""
    if len(sys.argv) < 2:
        print("Usage: python migrate.py [up|down|status]")
        sys.exit(1)
    
    command = sys.argv[1]
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("Error: DATABASE_URL environment variable not set")
        sys.exit(1)
    
    migration = DatabaseMigration(database_url)
    
    try:
        if command == 'up':
            migration.run_migrations()
        elif command == 'down' and len(sys.argv) > 2:
            migration.rollback_migration(sys.argv[2])
        elif command == 'status':
            migration.status()
        else:
            print("Invalid command. Use: up, down <filename>, or status")
            sys.exit(1)
    except Exception as e:
        print(f"Migration failed: {e}")
        sys.exit(1)
    finally:
        migration.conn.close()

if __name__ == "__main__":
    main()