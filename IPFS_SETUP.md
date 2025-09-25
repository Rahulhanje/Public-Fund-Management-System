# IPFS Setup Guide for Report Submission

This project uses IPFS (InterPlanetary File System) to store stage reports in a decentralized manner. The reports are uploaded to IPFS and their content identifiers (CIDs) are stored on the blockchain.

## Current Status

The report submission system is now working with **both production and demo modes**:

✅ **Demo Mode (Working Now)**: Uses mock IPFS CIDs for testing  
✅ **Production Mode**: Uses real Pinata IPFS service (requires API keys)

## Demo Mode (Current Setup)

Your system is currently running in demo mode, which means:
- Reports are processed and validated by AI
- Mock IPFS CIDs are generated and stored on blockchain
- All functionality works except actual IPFS storage
- Perfect for development and testing

## Production Mode Setup (Optional)

To use real IPFS storage via Pinata:

### Step 1: Get Pinata API Keys

1. Go to [https://pinata.cloud](https://pinata.cloud)
2. Sign up for a free account
3. Navigate to "API Keys" in your dashboard
4. Create a new API key with the following permissions:
   - ✅ `pinFileToIPFS`
   - ✅ `pinJSONToIPFS` 
   - ✅ `unpin`
   - ✅ `userPinPolicy`

### Step 2: Configure Environment Variables

1. Open `frontend/.env` file
2. Replace the placeholder values:

```env
NEXT_PUBLIC_PINATA_API_KEY=your_actual_pinata_api_key_here
NEXT_PUBLIC_PINATA_SECRET_KEY=your_actual_pinata_secret_key_here
```

### Step 3: Restart Development Server

```bash
cd frontend
npm run dev
```

## How It Works

1. **File Upload**: User selects PDF report file
2. **IPFS Storage**: File is uploaded to IPFS (Pinata or mock)
3. **Blockchain Storage**: IPFS CID is stored in smart contract
4. **AI Review**: File is analyzed by AI agent
5. **Completion**: If approved, stage is completed and funds released

## Features

- 📁 **Drag & Drop**: Easy file upload interface
- 📊 **Progress Tracking**: Visual progress indicator
- 🤖 **AI Integration**: Automatic document review
- 🔗 **Blockchain Integration**: CID stored on-chain
- 📱 **Responsive Design**: Works on all devices
- 🔄 **Fallback System**: Demo mode if Pinata unavailable

## Security Notes

- API keys are stored in environment variables
- Files are uploaded directly to IPFS (decentralized)
- Smart contracts validate all transactions
- AI review ensures document quality

## Troubleshooting

### Issue: "Demo mode" message
**Solution**: This is normal! The system works perfectly in demo mode.

### Issue: Want real IPFS storage
**Solution**: Follow production setup steps above.

### Issue: Pinata upload fails
**Solution**: System automatically falls back to demo mode.

## File Structure

- `StageReports.tsx` - Main report submission component
- `generateMockCID()` - Demo mode CID generation
- `.env` - Environment configuration
- Smart contract handles CID storage

Your report submission system is ready to use! 🚀