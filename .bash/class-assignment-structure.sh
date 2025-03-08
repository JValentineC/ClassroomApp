#!/bin/bash

# Define project root
PROJECT_ROOT="."

# Define directories
DIRECTORIES=(
  "$PROJECT_ROOT/app/classrooms/[id]"
  "$PROJECT_ROOT/app/api/assignments"
  "$PROJECT_ROOT/app/api/questions"
  "$PROJECT_ROOT/app/api/classrooms"
  "$PROJECT_ROOT/app/classrooms/components"
)

# Define files
FILES=(
  "$PROJECT_ROOT/app/classrooms/[id]/page.tsx"
  "$PROJECT_ROOT/app/api/assignments/route.ts"
  "$PROJECT_ROOT/app/api/questions/route.ts"
  "$PROJECT_ROOT/app/api/classrooms/route.ts"
  "$PROJECT_ROOT/app/classrooms/components/AssignmentCreateForm.tsx"
  "$PROJECT_ROOT/app/classrooms/components/AssignmentSubmitForm.tsx"
  "$PROJECT_ROOT/lib/query/classroom.ts"
)

# Create directories
echo "Creating directories..."
for dir in "${DIRECTORIES[@]}"; do
  if [ ! -d $dir ]; then mkdir -p "$dir"; fi
  echo "Created: $dir"
done

# Create files
echo "Creating files..."
for file in "${FILES[@]}"; do
  if [ ! -f $file ]; then touch "$file"; fi
  echo "Created: $file"
done

# Success message
echo "Project structure has been created successfully!"
