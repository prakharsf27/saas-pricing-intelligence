"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const node_cron_1 = __importDefault(require("node-cron"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./routes/api"));
const scraper_1 = require("./services/scraper");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/saas-pricing-intel';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api', api_1.default);
// Database Connection
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    // Start Server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    // Schedule Scraper via node-cron (Runs every day at midnight)
    node_cron_1.default.schedule('0 0 * * *', () => {
        console.log('Running scheduled cron job for SaaS Pricing Scraper...');
        (0, scraper_1.runScraper)();
    });
    // Optional: Run scraper once on startup if in dev mode
    // runScraper();
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
});
exports.default = app;
//# sourceMappingURL=index.js.map