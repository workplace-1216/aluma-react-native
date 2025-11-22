# Receipt Validation Requirements for App Store Compliance

## Issue

App Store Review found that receipt validation is failing when a production-signed app receives receipts from Apple's test environment (sandbox).

## Required Fix

When validating receipts on your server, your server needs to be able to handle a production-signed app getting its receipts from Apple's test environment.

## Recommended Approach

### Step 1: Always Validate Against Production First

Your production server should **always validate receipts against the production App Store first**.

### Step 2: Fallback to Sandbox on Error

If validation fails with the error code **"Sandbox receipt used in production"**, you should validate against the test environment instead.

## Implementation Pattern

```javascript
// Pseudo-code example
async function validateReceipt(receiptData) {
  try {
    // First attempt: Validate against production
    const productionResult = await validateWithApple(receiptData, {
      environment: 'production',
      url: 'https://buy.itunes.apple.com/verifyReceipt',
    });

    return productionResult;
  } catch (error) {
    // If error indicates sandbox receipt, validate against sandbox
    if (
      error.code === 'SandboxReceiptUsedInProduction' ||
      error.message?.includes('sandbox')
    ) {
      const sandboxResult = await validateWithApple(receiptData, {
        environment: 'sandbox',
        url: 'https://sandbox.itunes.apple.com/verifyReceipt',
      });

      return sandboxResult;
    }

    // Re-throw other errors
    throw error;
  }
}
```

## Key Points

1. **Production First**: Always try production validation first
2. **Sandbox Fallback**: Only use sandbox validation when production returns a sandbox receipt error
3. **Error Handling**: Properly detect sandbox receipt errors (status code 21007)
4. **Testing**: Test with both production and sandbox receipts

## Apple Documentation

- [Validating Receipts with the App Store](https://developer.apple.com/documentation/appstorereceipts/validating_receipts_with_the_app_store)
- Status Code 21007: "The receipt data is from the test environment, but it was sent to the production environment for verification."

## Notes

- This is a **backend/server-side** issue, not a client-side issue
- The React Native app uses RevenueCat SDK which handles receipt validation
- If you're using RevenueCat, ensure your RevenueCat dashboard is configured correctly
- If you have a custom backend, implement the production-first validation pattern above
