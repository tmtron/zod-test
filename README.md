# zod-nest-openapi test

just a test what it takes to integrate zod, nest and open-api-3 (swagger)

For the API we want 3 things:
1. a typescript type definition: an interface (preferred) or a class
1. a validation mechanism: zod, joi, class-validator, etc.
1. an open-api-3 schema

ideally we only want to define everything in one place (single source of truth)

## zod
With zod we can get validation and a typescript type-definition.  
- We can generate some oapi-schema info from the zod definition  
  that's what the code in this repo is about 
- Then we must augment this with additional metadata (e.g. summary, etc.)
- Finally we need a way to pass this to nestjs
