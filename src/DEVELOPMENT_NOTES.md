# Development Notes

## Important Conventions

### Component Exports
Always ensure components are properly exported before using them:

1. **Default Exports**: Use for main components
   ```typescript
   export default MyComponent;
   ```

2. **Named Exports**: Use for styled components and sub-components
   ```typescript
   export const StyledDiv = styled.div`...`;
   // OR at the bottom:
   export { StyledDiv };
   ```

3. **Mixed Exports**: When a file has both
   ```typescript
   // Styled components with export const
   export const Title = styled.h1`...`;
   
   // Main component
   const MyComponent = () => {...};
   
   // Export main component
   export default MyComponent;
   export { MyComponent }; // Also as named export if needed
   ```

### Common Import/Export Errors to Avoid

1. **Double exports**: Don't export the same item twice
   ```typescript
   // ❌ Wrong
   export const Title = styled.h1`...`;
   // ... later in file
   export { Title }; // Error: already exported
   
   // ✅ Correct
   export const Title = styled.h1`...`;
   ```

2. **Import mismatch**: Match import style to export style
   ```typescript
   // If exported as: export default Component
   import Component from './Component'; // ✅
   import { Component } from './Component'; // ❌
   
   // If exported as: export { Component }
   import { Component } from './Component'; // ✅
   import Component from './Component'; // ❌
   ```

3. **Check imports when seeing "Element type is invalid" errors**
   - This usually means an import/export mismatch
   - Check the file being imported from
   - Verify the export method matches the import method

## Testing Checklist

Before committing changes:
- [ ] Run `npm run lint` to check for linting errors
- [ ] Test all imports/exports are working
- [ ] Verify no console errors in browser
- [ ] Test the feature in mock mode if applicable