import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUsers,
  getUser,
  adminDeleteUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.delete("/admin-delete/:userId", verifyToken, adminDeleteUser);
router.get("/getUsers", verifyToken, getUsers);
router.get("/getUser", verifyToken, getUser);

export default router;
