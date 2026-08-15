"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, () => {
    console.log(`Server is running on PORT http://localhost:${PORT}`);
});
// {
//   "status": "success",
//   "message": "Account created successfully",
//   "data": {
//     "user": {
//       "id": "11442650-faab-4ddd-a7cb-2d80cf6c78a1",
//       "firstName": "Jane",
//       "lastName": "Doe",
//       "email": "sam.receiver@example.com"
//     },
//     "wallet": {
//       "id": "366c3f78-7fbf-4d2d-8bb5-67b0585561c2",
//       "balance": 0
//     }
//   }
// }
// {
//   "status": "success",
//   "message": "Account created successfully",
//   "data": {
//     "user": {
//       "id": "aaedc2e4-dcdc-4fb6-b42a-4ecf03b209b6",
//       "firstName": "Jane",
//       "lastName": "Doe",
//       "email": "jane.receiver@example.com"
//     },
//     "wallet": {
//       "id": "2f0681b9-4269-4bf9-bb9b-cefca66c5f72",
//       "balance": 0
//     }
//   }
// }
