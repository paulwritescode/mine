# Database Troubleshooting Guide

## Foreign Key Constraint Violations

If you encounter foreign key constraint violations during app initialization, this typically means there are orphaned records in the database (e.g., snippets referencing deleted projects).

### Error Message
```
ERROR Foreign key constraint violations found: [{"fkid": 0, "parent": "projects", "rowid": 1, "table": "snippets"}]
ERROR Database integrity validation failed
```

### Automatic Recovery
The app now includes automatic recovery mechanisms:

1. **Orphaned Record Cleanup**: The database service will automatically detect and remove orphaned snippets that reference non-existent projects.

2. **Database Reset**: If cleanup fails, the database will be automatically reset and recreated with fresh schema.

### Manual Recovery Options

#### Option 1: Reset Database (Recommended)
```bash
npm run reset-database
```

This will:
- Remove the existing database file
- Allow the app to recreate a fresh database on next launch
- **Note**: This will delete all existing data

#### Option 2: Development Reset
If you're in development and want to start fresh:
```bash
npm run reset-project
```

### Prevention
- Always use the provided services (ProjectService, SnippetService) for database operations
- Avoid direct database manipulation
- The foreign key constraints are in place to maintain data integrity

### Database Schema
The database includes these main tables:
- `projects`: Main project records
- `snippets`: Video snippets linked to projects via `project_id`
- `settings`: App configuration
- `schema_migrations`: Migration tracking

Foreign key relationships:
- `snippets.project_id` → `projects.id` (CASCADE DELETE)

### Recovery Process
1. App detects foreign key violations
2. Attempts to clean up orphaned records
3. If cleanup fails, resets database completely
4. Recreates schema with migrations
5. Validates integrity again
6. If still failing, throws error for manual intervention