var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/models/User.ts
var User_exports = {};
__export(User_exports, {
  User: () => User,
  default: () => User_default
});
import mongoose2, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
var UserSchema, User, User_default;
var init_User = __esm({
  "server/models/User.ts"() {
    "use strict";
    UserSchema = new Schema({
      username: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        select: false,
        // Don't include password in normal queries
        // @deprecated
        deprecated: "Password authentication is being phased out. Please migrate to OTP authentication."
      },
      hasPassword: {
        type: Boolean,
        default: false,
        // @deprecated
        deprecated: "Password authentication is being phased out. Please migrate to OTP authentication."
      },
      preferredAuthMethod: {
        type: String,
        enum: ["otp", "password"],
        default: "otp"
      },
      isAdmin: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
      lastLogin: {
        type: Date
      },
      deviceInfo: {
        lastDevices: [{
          ipAddress: String,
          userAgent: String,
          lastUsed: {
            type: Date,
            default: Date.now
          }
        }]
      },
      backupCodes: [{
        type: String,
        select: false
        // Don't include backup codes in normal queries
      }],
      migrationStatus: {
        notifiedAt: Date,
        reminderCount: {
          type: Number,
          default: 0
        },
        lastReminder: Date,
        scheduledDeletionDate: Date
      }
    });
    UserSchema.index({ "deviceInfo.lastDevices.ipAddress": 1 });
    UserSchema.index({ "migrationStatus.scheduledDeletionDate": 1 });
    UserSchema.pre("save", function(next) {
      this.updatedAt = /* @__PURE__ */ new Date();
      next();
    });
    UserSchema.pre("save", async function(next) {
      if (this.isModified("password") && this.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
          this.hasPassword = true;
        } catch (error) {
          next(error instanceof Error ? error : new Error("Password hashing failed"));
          return;
        }
      }
      next();
    });
    UserSchema.methods.comparePassword = async function(candidatePassword) {
      if (!this.password) return false;
      try {
        return await bcrypt.compare(candidatePassword, this.password);
      } catch (error) {
        console.error("Error comparing passwords:", error);
        return false;
      }
    };
    User = mongoose2.model("User", UserSchema);
    User_default = User;
  }
});

// server/models/Subcategory.ts
var Subcategory_exports = {};
__export(Subcategory_exports, {
  Subcategory: () => Subcategory
});
import mongoose6, { Schema as Schema5 } from "mongoose";
var SubcategorySchema, Subcategory;
var init_Subcategory = __esm({
  "server/models/Subcategory.ts"() {
    "use strict";
    SubcategorySchema = new Schema5({
      name: {
        type: String,
        required: true,
        trim: true
      },
      categoryId: {
        type: Schema5.Types.ObjectId,
        ref: "Category",
        required: true
      },
      serviceIds: {
        type: [String],
        default: []
      }
    }, {
      timestamps: true,
      // Adds createdAt and updatedAt fields
      toJSON: {
        virtuals: true,
        transform: (_, ret) => {
          ret.id = ret._id.toString();
          delete ret._id;
          delete ret.__v;
          return ret;
        }
      },
      collection: "subcategories"
      // Explicitly set the collection name
    });
    SubcategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });
    Subcategory = mongoose6.models.Subcategory || mongoose6.model("Subcategory", SubcategorySchema);
  }
});

// server/models/Ticket.ts
var Ticket_exports = {};
__export(Ticket_exports, {
  Ticket: () => Ticket
});
import mongoose7, { Schema as Schema6 } from "mongoose";
var ticketSchema, Ticket;
var init_Ticket = __esm({
  "server/models/Ticket.ts"() {
    "use strict";
    ticketSchema = new Schema6({
      serviceId: {
        type: String,
        required: true
      },
      serviceName: {
        type: String,
        required: true
      },
      userId: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ["new", "processing", "completed", "rejected"],
        default: "new"
      },
      priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    });
    ticketSchema.pre("save", function(next) {
      this.updatedAt = /* @__PURE__ */ new Date();
      next();
    });
    Ticket = mongoose7.model("Ticket", ticketSchema);
  }
});

// server/models/Task.ts
var Task_exports = {};
__export(Task_exports, {
  Task: () => Task
});
import mongoose8, { Schema as Schema7 } from "mongoose";
var taskSchema, Task;
var init_Task = __esm({
  "server/models/Task.ts"() {
    "use strict";
    taskSchema = new Schema7({
      ticketId: {
        type: Schema7.Types.ObjectId,
        ref: "Ticket",
        required: true
      },
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ["pending", "in_progress", "completed"],
        default: "pending"
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      dueDate: {
        type: Date,
        required: true
      },
      assigneeId: {
        type: Schema7.Types.ObjectId,
        ref: "User",
        required: true
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    });
    taskSchema.pre("save", function(next) {
      this.updatedAt = /* @__PURE__ */ new Date();
      next();
    });
    Task = mongoose8.model("Task", taskSchema);
  }
});

// server/models/AppService.ts
var AppService_exports = {};
__export(AppService_exports, {
  AppService: () => AppService
});
import mongoose12, { Schema as Schema10 } from "mongoose";
var ProcessStepSchema, FAQSchema, ContactInfoSchema, AppServiceSchema, AppService;
var init_AppService = __esm({
  "server/models/AppService.ts"() {
    "use strict";
    ProcessStepSchema = new Schema10({
      title: {
        type: String,
        required: true
      },
      steps: {
        type: [String],
        required: true
      }
    });
    FAQSchema = new Schema10({
      question: {
        type: String,
        required: true
      },
      answer: {
        type: String,
        required: true
      }
    });
    ContactInfoSchema = new Schema10({
      phone: {
        type: String,
        default: "123-456-7890"
      },
      email: {
        type: String,
        default: "contact@example.com"
      }
    });
    AppServiceSchema = new Schema10({
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        default: "\u{1F4C4}"
      },
      category: {
        type: String,
        default: "general"
      },
      subcategoryIds: {
        type: [Schema10.Types.ObjectId],
        ref: "Subcategory",
        default: []
      },
      features: {
        type: [String],
        default: ["New service feature"]
      },
      eligibility: {
        type: [String],
        default: ["Everyone is eligible"]
      },
      process: {
        type: [ProcessStepSchema],
        default: [{
          title: "Simple Process",
          steps: ["Contact us to get started"]
        }]
      },
      documents: {
        type: [String],
        default: ["No documents required"]
      },
      faqs: {
        type: [FAQSchema],
        default: [{
          question: "How do I get started?",
          answer: "Contact us to learn more about this service."
        }]
      },
      contactInfo: {
        type: ContactInfoSchema,
        default: {
          phone: "123-456-7890",
          email: "contact@example.com"
        }
      }
    }, {
      timestamps: true,
      // Adds createdAt and updatedAt fields
      collection: "appservices",
      // Explicitly set the collection name
      toJSON: {
        virtuals: true,
        transform: (_, ret) => {
          ret.id = ret._id.toString();
          delete ret._id;
          delete ret.__v;
          return ret;
        }
      }
    });
    AppService = mongoose12.models.AppService || mongoose12.model("AppService", AppServiceSchema);
  }
});

// server/models/Service.ts
var Service_exports = {};
__export(Service_exports, {
  Service: () => Service
});
import mongoose13, { Schema as Schema11 } from "mongoose";
var ProcessStepSchema2, FAQSchema2, ContactInfoSchema2, ServiceSchema, Service;
var init_Service = __esm({
  "server/models/Service.ts"() {
    "use strict";
    ProcessStepSchema2 = new Schema11({
      title: {
        type: String,
        required: true
      },
      steps: {
        type: [String],
        required: true
      }
    });
    FAQSchema2 = new Schema11({
      question: {
        type: String,
        required: true
      },
      answer: {
        type: String,
        required: true
      }
    });
    ContactInfoSchema2 = new Schema11({
      phone: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      }
    });
    ServiceSchema = new Schema11({
      title: {
        type: String,
        required: true,
        trim: true
      },
      icon: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      features: {
        type: [String],
        required: true
      },
      popular: {
        type: Boolean,
        default: false
      },
      eligibility: {
        type: [String],
        required: true
      },
      process: {
        type: [ProcessStepSchema2],
        required: true
      },
      documents: {
        type: [String],
        required: true
      },
      faqs: {
        type: [FAQSchema2],
        required: true
      },
      contactInfo: {
        type: ContactInfoSchema2,
        required: true
      },
      category: {
        type: String,
        default: "general"
      },
      subcategoryIds: {
        type: [String],
        default: []
      }
    }, {
      timestamps: true,
      // Add timestamps for tracking created/updated times
      toJSON: {
        virtuals: true,
        transform: (_, ret) => {
          ret.id = ret._id.toString();
          delete ret._id;
          delete ret.__v;
          return ret;
        }
      }
    });
    Service = mongoose13.model("Service", ServiceSchema);
  }
});

// server/models/TaskView.ts
var TaskView_exports = {};
__export(TaskView_exports, {
  TaskView: () => TaskView
});
import mongoose14, { Schema as Schema12 } from "mongoose";
var taskViewSchema, TaskView;
var init_TaskView = __esm({
  "server/models/TaskView.ts"() {
    "use strict";
    taskViewSchema = new Schema12({
      userId: {
        type: Schema12.Types.ObjectId,
        ref: "User",
        required: true
      },
      taskId: {
        type: Schema12.Types.ObjectId,
        ref: "Task",
        required: true
      },
      viewedAt: {
        type: Date,
        default: Date.now
      }
    });
    taskViewSchema.index({ userId: 1, taskId: 1 }, { unique: true });
    TaskView = mongoose14.model("TaskView", taskViewSchema);
  }
});

// server/index.ts
import { createServer } from "http";

// server/config/server-config.ts
import express from "express";
import session from "express-session";

// server/config/env/index.ts
import dotenv from "dotenv";
import path from "path";
var envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env.development";
dotenv.config({
  path: path.resolve(process.cwd(), envFile)
});
var env = {
  // Node environment
  nodeEnv: process.env.NODE_ENV || "development",
  isDevelopment: (process.env.NODE_ENV || "development") === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    host: process.env.HOST || "localhost"
  },
  // Database configuration
  database: {
    // MongoDB configuration with hardcoded URI
    mongodb: {
      uri: "mongodb+srv://claimsutra:y2tmBpzEZHe8DVOl@claimsutra.vtcut.mongodb.net/?retryWrites=true&w=majority&appName=claimsutra"
    },
    // PostgreSQL configuration (if needed)
    postgres: {
      url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/claimsutra",
      ssl: process.env.NODE_ENV === "production"
    }
  },
  // Authentication configuration
  auth: {
    sessionSecret: process.env.SESSION_SECRET || "dev-session-secret-replace-in-production",
    jwtSecret: process.env.JWT_SECRET || "dev-jwt-secret-replace-in-production",
    cookieSecure: process.env.NODE_ENV === "production",
    sessionDuration: 30 * 24 * 60 * 60 * 1e3
    // 30 days in milliseconds
  },
  // API configuration
  api: {
    // Add any API keys or external service configurations here
  }
};
function validateEnv() {
  const requiredVars = [
    "SESSION_SECRET"
  ];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);
  if (missingVars.length > 0) {
    const message = `Missing required environment variables: ${missingVars.join(", ")}`;
    if (env.isProduction) {
      throw new Error(message);
    } else {
      console.warn(`\u26A0\uFE0F  Warning: ${message}`);
      console.warn("Using default values for development. DO NOT use these in production!");
    }
  }
}

// server/config/server-config.ts
function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });
  if (process.env.NODE_ENV === "production") {
    app.use(express.static("dist"));
  }
  app.use(session({
    secret: env.auth.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.isProduction,
      httpOnly: true,
      maxAge: env.auth.sessionDuration
    }
  }));
  return app;
}

// server/db/mongodb-connection.ts
import mongoose from "mongoose";
mongoose.set("strictQuery", false);
async function connectToMongoDB() {
  try {
    validateEnv();
    await mongoose.connect(env.database.mongodb.uri);
    console.log("Successfully connected to MongoDB database");
    if (env.isDevelopment) {
      console.log(`Connected to MongoDB in ${env.nodeEnv} mode`);
    }
    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB database:", error);
    throw error;
  }
}
async function closeMongoDB() {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    return true;
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    throw error;
  }
}

// server/routes.ts
import mongoose15 from "mongoose";

// server/storage-mongo.ts
init_User();
import mongoose9 from "mongoose";

// server/models/Complaint.ts
import mongoose3, { Schema as Schema2 } from "mongoose";
var ComplaintSchema = new Schema2({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  userId: {
    type: Schema2.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});
var Complaint = mongoose3.model("Complaint", ComplaintSchema);

// server/models/BlogPost.ts
import mongoose4, { Schema as Schema3 } from "mongoose";
var BlogPostSchema = new Schema3({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});
var BlogPost = mongoose4.model("BlogPost", BlogPostSchema);

// server/models/Category.ts
import mongoose5, { Schema as Schema4 } from "mongoose";
var CategorySchema = new Schema4({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  icon: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  number: {
    type: Number,
    default: 0,
    required: false
  },
  tags: {
    type: [String],
    default: [],
    required: false
  }
}, {
  timestamps: true,
  // Adds createdAt and updatedAt fields
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  collection: "categories"
  // Explicitly set the collection name
});
var Category = mongoose5.models.Category || mongoose5.model("Category", CategorySchema);

// server/storage-mongo.ts
init_Subcategory();
init_Ticket();
init_Task();
import MongoStore from "connect-mongo";
var MongoStorage = class {
  constructor() {
    connectToMongoDB().then(() => {
      console.log("MongoDB connection established in MongoStorage");
    }).catch((err) => {
      console.error("Failed to connect to MongoDB in MongoStorage:", err);
    });
    this.sessionStore = MongoStore.create({
      mongoUrl: env.database.mongodb.uri,
      collectionName: "sessions",
      ttl: env.auth.sessionDuration / 1e3,
      // Convert from ms to seconds
      autoRemove: "disabled",
      // Disable automatic removal to prevent premature session deletion
      touchAfter: 60,
      // Update session every minute if there are changes
      crypto: {
        secret: env.auth.sessionSecret
      },
      mongoOptions: {
        serverSelectionTimeoutMS: 1e4,
        socketTimeoutMS: 45e3,
        family: 4
      },
      stringify: false,
      // Don't stringify session data
      autoReconnect: true,
      fallbackMemory: true
      // Use memory as fallback if DB connection fails
    });
    this.sessionStore.on("error", (error) => {
      console.error("Session store error:", error);
    });
    if (env.isDevelopment) {
      this.sessionStore.on("create", (sessionId) => {
        console.log("Session created:", sessionId);
      });
      this.sessionStore.on("touch", (sessionId) => {
        console.log("Session touched:", sessionId);
      });
      this.sessionStore.on("destroy", (sessionId) => {
        console.log("Session destroyed:", sessionId);
      });
    }
  }
  // Helper method to validate MongoDB connection
  validateConnection() {
    if (mongoose9.connection.readyState !== 1) {
      console.error("MongoDB connection is not open. Current state:", mongoose9.connection.readyState);
      throw new Error("Database connection is not available");
    }
  }
  async createComplaint(insertComplaint) {
    const complaint = new Complaint(insertComplaint);
    await complaint.save();
    return complaint.toJSON();
  }
  async getComplaints() {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    return complaints.map((complaint) => complaint.toJSON());
  }
  async getBlogPosts() {
    const blogPosts = await BlogPost.find().sort({ createdAt: -1 });
    return blogPosts.map((post) => post.toJSON());
  }
  async createBlogPost(insertPost) {
    const blogPost = new BlogPost(insertPost);
    await blogPost.save();
    return blogPost.toJSON();
  }
  async createUser(insertUser) {
    const user = new User(insertUser);
    await user.save();
    const userDoc = user.toObject();
    return {
      id: user._id.toString(),
      username: userDoc.username,
      createdAt: userDoc.createdAt,
      preferredAuthMethod: userDoc.preferredAuthMethod
    };
  }
  async getUser(id) {
    try {
      this.validateConnection();
      if (!mongoose9.Types.ObjectId.isValid(id)) {
        console.error("Invalid MongoDB ID format:", id);
        throw new Error("Invalid user ID format");
      }
      const user = await User.findById(id);
      if (!user) {
        console.error("User not found for ID:", id);
        throw new Error("User not found");
      }
      const userDoc = user.toObject();
      return {
        id: user._id.toString(),
        username: userDoc.username,
        createdAt: userDoc.createdAt,
        preferredAuthMethod: userDoc.preferredAuthMethod
      };
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("User not found or invalid ID format");
    }
  }
  async getUserByUsername(username) {
    const user = await User.findOne({ username });
    if (!user) return null;
    const userDoc = user.toObject();
    return {
      id: user._id.toString(),
      username: userDoc.username,
      createdAt: userDoc.createdAt,
      preferredAuthMethod: userDoc.preferredAuthMethod
    };
  }
  // Category methods
  async getCategories() {
    const categories = await Category.find().sort({ name: 1 });
    return categories.map((category) => category.toJSON());
  }
  async getCategoryById(id) {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error("Category not found");
      }
      return category.toJSON();
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      throw new Error("Category not found or invalid ID format");
    }
  }
  async createCategory(insertCategory) {
    try {
      console.log("MongoStorage: Creating category with data:", insertCategory);
      const existingCategory = await Category.findOne({ name: insertCategory.name });
      if (existingCategory) {
        console.log("MongoStorage: Category already exists:", existingCategory);
        return existingCategory.toJSON();
      }
      const category = new Category(insertCategory);
      console.log("MongoStorage: Category model instance created:", category);
      const savedCategory = await category.save();
      console.log("MongoStorage: Category saved to database:", savedCategory);
      return savedCategory.toJSON();
    } catch (error) {
      console.error("Error creating category in MongoDB:", error);
      if (error.code === 11e3) {
        throw new Error("A category with this name already exists");
      }
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }
  async updateCategory(id, updateData) {
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: /* @__PURE__ */ new Date() },
        { new: true, runValidators: true }
      );
      if (!category) {
        throw new Error("Category not found");
      }
      return category.toJSON();
    } catch (error) {
      console.error("Error updating category:", error);
      if (error.code === 11e3) {
        throw new Error("A category with this name already exists");
      }
      throw new Error("Failed to update category");
    }
  }
  async deleteCategory(id) {
    try {
      const subcategoryCount = await Subcategory.countDocuments({ categoryId: id });
      if (subcategoryCount > 0) {
        throw new Error("Cannot delete category that has subcategories");
      }
      const result = await Category.deleteOne({ _id: id });
      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
  // Subcategory methods
  async getSubcategories() {
    const subcategories = await Subcategory.find().sort({ name: 1 });
    return subcategories.map((subcategory) => subcategory.toJSON());
  }
  async getSubcategoriesByCategory(categoryId) {
    const subcategories = await Subcategory.find({ categoryId }).sort({ name: 1 });
    return subcategories.map((subcategory) => subcategory.toJSON());
  }
  async getSubcategoryById(id) {
    try {
      const subcategory = await Subcategory.findById(id);
      if (!subcategory) {
        throw new Error("Subcategory not found");
      }
      return subcategory.toJSON();
    } catch (error) {
      console.error("Error fetching subcategory by ID:", error);
      throw new Error("Subcategory not found or invalid ID format");
    }
  }
  async createSubcategory(insertSubcategory) {
    try {
      console.log("MongoStorage: Creating subcategory with data:", insertSubcategory);
      const categoryExists = await Category.exists({ _id: insertSubcategory.categoryId });
      if (!categoryExists) {
        console.error("MongoStorage: Category not found for subcategory creation:", insertSubcategory.categoryId);
        throw new Error("Category not found");
      }
      console.log("MongoStorage: Category exists, creating subcategory model");
      const subcategory = new Subcategory(insertSubcategory);
      console.log("MongoStorage: Subcategory model created, saving to database");
      const savedSubcategory = await subcategory.save();
      console.log("MongoStorage: Subcategory saved successfully:", savedSubcategory);
      return savedSubcategory.toJSON();
    } catch (error) {
      console.error("Error creating subcategory in MongoDB:", error);
      if (error.code === 11e3) {
        throw new Error("A subcategory with this name already exists in this category");
      }
      throw error;
    }
  }
  async updateSubcategory(id, updateData) {
    try {
      if (updateData.categoryId) {
        const categoryExists = await Category.exists({ _id: updateData.categoryId });
        if (!categoryExists) {
          throw new Error("Category not found");
        }
      }
      const subcategory = await Subcategory.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: /* @__PURE__ */ new Date() },
        { new: true, runValidators: true }
      );
      if (!subcategory) {
        throw new Error("Subcategory not found");
      }
      return subcategory.toJSON();
    } catch (error) {
      console.error("Error updating subcategory:", error);
      if (error.code === 11e3) {
        throw new Error("A subcategory with this name already exists in this category");
      }
      throw error;
    }
  }
  async deleteSubcategory(id) {
    try {
      const result = await Subcategory.deleteOne({ _id: id });
      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      throw error;
    }
  }
  // Ticket methods
  async getTickets(page = 1, limit = 10, filter = {}) {
    try {
      console.log("=== getTickets method called ===");
      console.log("Parameters:", { page, limit, filter });
      const skip = (page - 1) * limit;
      this.validateConnection();
      console.log("MongoDB connection is available, proceeding with query");
      console.log("Executing query with filter:", JSON.stringify(filter));
      const tickets = await Ticket.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean();
      console.log(`Query executed successfully, found ${tickets.length} tickets`);
      const total = await Ticket.countDocuments(filter);
      console.log(`Total tickets matching filter: ${total}`);
      const formattedTickets = tickets.map((ticket) => {
        console.log(`Processing ticket ID: ${ticket._id}`);
        return {
          ...ticket,
          id: ticket._id.toString()
        };
      });
      console.log("Successfully formatted tickets for response");
      return {
        tickets: formattedTickets,
        total
      };
    } catch (error) {
      console.error("Error fetching tickets:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw new Error(`Failed to fetch tickets: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  async getTicketsByUser(userId) {
    try {
      console.log(`=== getTicketsByUser called for user ID: ${userId} ===`);
      this.validateConnection();
      const tickets = await Ticket.find({ userId }).sort({ updatedAt: -1 }).lean();
      console.log(`Found ${tickets.length} tickets for user ${userId}`);
      return tickets.map((ticket) => ({
        ...ticket,
        id: ticket._id.toString()
      }));
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw new Error(`Failed to fetch user tickets: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  async getTicketById(id) {
    try {
      console.log(`=== getTicketById called for ticket ID: ${id} ===`);
      this.validateConnection();
      const ticket = await Ticket.findById(id).lean();
      if (!ticket) {
        console.error(`Ticket with ID ${id} not found`);
        throw new Error("Ticket not found");
      }
      console.log(`Successfully found ticket with ID: ${id}`);
      return {
        ...ticket,
        id: ticket._id.toString()
      };
    } catch (error) {
      console.error("Error fetching ticket by ID:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw new Error(`Ticket not found or invalid ID format: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  async createTicket(insertTicket) {
    try {
      console.log(`=== createTicket called ===`);
      console.log("Ticket data:", JSON.stringify(insertTicket, null, 2));
      this.validateConnection();
      if (insertTicket.userId) {
        const userExists = await User.exists({ _id: insertTicket.userId });
        if (!userExists) {
          console.error(`User with ID ${insertTicket.userId} not found`);
        }
      }
      const ticket = new Ticket(insertTicket);
      await ticket.save();
      console.log(`Ticket created successfully with ID: ${ticket._id}`);
      return {
        ...ticket.toJSON(),
        id: ticket._id.toString()
      };
    } catch (error) {
      console.error("Error creating ticket:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw new Error(`Failed to create ticket: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  async updateTicket(id, updateData) {
    try {
      console.log(`=== updateTicket called for ticket ID: ${id} ===`);
      console.log("Update data:", JSON.stringify(updateData, null, 2));
      this.validateConnection();
      const ticket = await Ticket.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: /* @__PURE__ */ new Date() },
        { new: true, runValidators: true }
      );
      if (!ticket) {
        console.error(`Ticket with ID ${id} not found for update`);
        throw new Error("Ticket not found");
      }
      console.log(`Ticket updated successfully: ${id}`);
      return {
        ...ticket.toJSON(),
        id: ticket._id.toString()
      };
    } catch (error) {
      console.error(`Error updating ticket ${id}:`, error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw new Error(`Failed to update ticket: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  async deleteTicket(id) {
    try {
      console.log(`=== deleteTicket called for ticket ID: ${id} ===`);
      this.validateConnection();
      const taskCount = await Task.countDocuments({ ticketId: id });
      console.log(`Found ${taskCount} tasks associated with ticket ${id}`);
      if (taskCount > 0) {
        console.log(`Deleting ${taskCount} tasks associated with ticket ${id}`);
        const taskDeleteResult = await Task.deleteMany({ ticketId: id });
        console.log(`Deleted ${taskDeleteResult.deletedCount} tasks`);
      }
      console.log(`Deleting ticket ${id}`);
      const result = await Ticket.deleteOne({ _id: id });
      const success = result.deletedCount === 1;
      if (success) {
        console.log(`Successfully deleted ticket ${id}`);
      } else {
        console.log(`Ticket ${id} not found for deletion`);
      }
      return success;
    } catch (error) {
      console.error(`Error deleting ticket ${id}:`, error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw new Error(`Failed to delete ticket: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  // Task methods
  async getTasks(ticketId) {
    try {
      console.log(`=== getTasks called for ticket ID: ${ticketId} ===`);
      this.validateConnection();
      const ticketExists = await Ticket.exists({ _id: ticketId });
      if (!ticketExists) {
        console.log(`Warning: Getting tasks for non-existent ticket ${ticketId}`);
      }
      const tasks = await Task.find({ ticketId }).sort({ createdAt: -1 }).lean();
      console.log(`Found ${tasks.length} tasks for ticket ${ticketId}`);
      return tasks.map((task) => ({
        ...task,
        id: task._id.toString()
      }));
    } catch (error) {
      console.error(`Error fetching tasks for ticket ${ticketId}:`, error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw new Error(`Failed to fetch tasks: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  async getTaskById(id) {
    try {
      const task = await Task.findById(id).lean();
      if (!task) {
        throw new Error("Task not found");
      }
      return {
        ...task,
        id: task._id.toString()
      };
    } catch (error) {
      console.error("Error fetching task by ID:", error);
      throw new Error("Task not found or invalid ID format");
    }
  }
  async createTask(insertTask) {
    try {
      const ticketExists = await Ticket.exists({ _id: insertTask.ticketId });
      if (!ticketExists) {
        throw new Error("Ticket not found");
      }
      const assigneeExists = await User.exists({ _id: insertTask.assigneeId });
      if (!assigneeExists) {
        throw new Error("Assignee not found");
      }
      const task = new Task(insertTask);
      await task.save();
      return {
        ...task.toJSON(),
        id: task._id.toString()
      };
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }
  async updateTask(id, updateData) {
    try {
      if (updateData.ticketId) {
        const ticketExists = await Ticket.exists({ _id: updateData.ticketId });
        if (!ticketExists) {
          throw new Error("Ticket not found");
        }
      }
      if (updateData.assigneeId) {
        const assigneeExists = await User.exists({ _id: updateData.assigneeId });
        if (!assigneeExists) {
          throw new Error("Assignee not found");
        }
      }
      const task = await Task.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: /* @__PURE__ */ new Date() },
        { new: true, runValidators: true }
      );
      if (!task) {
        throw new Error("Task not found");
      }
      return {
        ...task.toJSON(),
        id: task._id.toString()
      };
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task");
    }
  }
  async deleteTask(id) {
    try {
      const result = await Task.deleteOne({ _id: id });
      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
};
var mongoStorage = new MongoStorage();

// server/storage.ts
var storage = new MongoStorage();

// shared/schema.ts
import { z } from "zod";
var userSchema = z.object({
  id: z.string().optional(),
  // MongoDB ObjectId is a string
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  createdAt: z.date().or(z.string()).optional(),
  // MongoDB might return date as string
  isAdmin: z.boolean().optional().default(false),
  preferredAuthMethod: z.enum(["otp", "password"]).optional().default("otp")
});
var complaintSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  policyNumber: z.string().min(1, "Policy number is required"),
  insuranceType: z.string().min(1, "Insurance type is required"),
  message: z.string().min(1, "Message is required"),
  userId: z.string().optional(),
  createdAt: z.date().or(z.string()).optional()
});
var blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  createdAt: z.date().or(z.string()).optional()
});
var categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Category name is required"),
  icon: z.string().optional(),
  description: z.string().optional(),
  number: z.number().default(0),
  tags: z.array(z.string()).optional().default([]),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional()
});
var subcategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Subcategory name is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  serviceIds: z.array(z.string()).optional().default([]),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional()
});
var ticketSchema2 = z.object({
  id: z.string().optional(),
  serviceId: z.string().min(1, "Service ID is required"),
  serviceName: z.string().min(1, "Service name is required"),
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["new", "processing", "completed", "rejected"]).default("new"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional()
});
var taskSchema2 = z.object({
  id: z.string().optional(),
  ticketId: z.string().min(1, "Ticket ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
  createdAt: z.date().or(z.string()).optional(),
  dueDate: z.date().or(z.string()),
  assigneeId: z.string().min(1, "Assignee ID is required"),
  updatedAt: z.date().or(z.string()).optional()
});
var insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true
});
var insertComplaintSchema = complaintSchema.omit({
  id: true,
  createdAt: true,
  userId: true
});
var insertBlogPostSchema = blogPostSchema.omit({
  id: true,
  createdAt: true
});
var insertCategorySchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSubcategorySchema = subcategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTicketSchema = ticketSchema2.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTaskSchema = taskSchema2.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var updateCategorySchema = insertCategorySchema.partial();
var updateSubcategorySchema = insertSubcategorySchema.partial();
var updateTicketSchema = insertTicketSchema.partial();
var updateTaskSchema = insertTaskSchema.partial();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
function setupAuth(app, storage2) {
  const sessionSettings = {
    secret: env.auth.sessionSecret,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    name: "sessionId",
    proxy: true,
    cookie: {
      secure: env.auth.cookieSecure,
      httpOnly: true,
      maxAge: env.auth.sessionDuration,
      path: "/",
      sameSite: env.isProduction ? "strict" : "lax",
      domain: env.isDevelopment ? void 0 : env.server.host
    },
    store: storage2.sessionStore
  };
  if (env.isProduction) {
    app.set("trust proxy", 1);
  }
  app.use(session2(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());
  if (env.isDevelopment) {
    app.use((req, res, next) => {
      console.log("Session ID:", req.sessionID);
      console.log("Is Authenticated:", req.isAuthenticated());
      console.log("Session Data:", {
        id: req.sessionID,
        cookie: req.session.cookie,
        passport: req.session.passport,
        user: req.user
      });
      next();
    });
  }
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage2.getUserByUsername(username);
        if (!user || password !== user.password) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.id);
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      console.log("Deserializing user:", id);
      if (!id) {
        console.error("Invalid user ID format:", id);
        return done(null, false);
      }
      const user = await storage2.getUser(id);
      if (!user) {
        console.error("User not found for ID:", id);
        return done(null, false);
      }
      console.log("User deserialized successfully:", user.id);
      done(null, user);
    } catch (error) {
      console.error("Deserialize user error:", error);
      done(error);
    }
  });
  app.post("/api/login", async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          message: "Missing required fields",
          details: "Username and password are required"
        });
      }
      let user = await storage2.getUserByUsername(username);
      if (user) {
        if (password !== user.password) {
          return res.status(401).json({ message: "Invalid password" });
        }
      } else {
        try {
          user = await storage2.createUser({
            username,
            password,
            isAdmin: false,
            preferredAuthMethod: "otp"
          });
          console.log("New user created:", username);
        } catch (error) {
          console.error("User creation error:", error);
          return res.status(500).json({
            message: "Error creating user",
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Session creation error:", loginErr);
          return res.status(500).json({ message: "Error creating session" });
        }
        const safeUser = {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt
        };
        return res.json(safeUser);
      });
    } catch (error) {
      console.error("Login/Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.sendStatus(200);
    });
  });
  app.get("/api/auth/me", (req, res) => {
    console.log("GET /api/auth/me - Session:", {
      id: req.sessionID,
      isAuthenticated: req.isAuthenticated(),
      session: req.session
    });
    if (!req.isAuthenticated()) {
      if (req.session?.passport?.user && !req.user) {
        console.log("Session exists but user not loaded, attempting to reload");
        return passport.authenticate("session")(req, res, () => {
          if (req.user) {
            res.json(req.user);
          } else {
            res.status(401).json({ error: "session_expired" });
          }
        });
      }
      return res.status(401).json({ error: "not_authenticated" });
    }
    res.json(req.user);
  });
}

// server/admin-auth.ts
import express2 from "express";

// server/models/AdminUser.ts
import mongoose10, { Schema as Schema8 } from "mongoose";
import bcrypt2 from "bcryptjs";
var AdminUserSchema = new Schema8({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "admin" },
  isAdmin: { type: Boolean, default: true }
}, { timestamps: true, collection: "adminlogin" });
AdminUserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  try {
    console.log("Hashing password for admin user:", this.username);
    const salt = await bcrypt2.genSalt(10);
    this.password = await bcrypt2.hash(this.password, salt);
    console.log("Password hashed successfully");
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});
AdminUserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log("Comparing password for user:", this.username);
    const isMatch = await bcrypt2.compare(candidatePassword, this.password);
    console.log("Password match result:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};
var AdminUser_default = mongoose10.model("AdminLogin", AdminUserSchema);

// server/admin-auth.ts
import jwt from "jsonwebtoken";
var router = express2.Router();
router.post("/login", async (req, res) => {
  try {
    console.log("Admin login attempt with:", req.body);
    const { username, password } = req.body;
    console.log("Finding admin user with username:", username);
    const admin = await AdminUser_default.findOne({ username });
    if (!admin) {
      console.log("Admin user not found with username:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("Admin user found:", admin.username);
    console.log("Comparing passwords...");
    const isMatch = await admin.comparePassword(password);
    console.log("Password match result:", isMatch);
    if (!isMatch) {
      console.log("Password does not match for user:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("Creating JWT token for admin:", admin.username);
    const token = jwt.sign(
      { id: admin._id, role: admin.role, isAdmin: true },
      process.env.JWT_SECRET || "adminsecret",
      { expiresIn: "1d" }
    );
    console.log("Admin login successful for user:", admin.username);
    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "adminsecret");
    const admin = await AdminUser_default.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.json({
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});
var admin_auth_default = router;

// server/middleware/admin-auth.ts
import jwt2 from "jsonwebtoken";
var adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    const decoded = jwt2.verify(token, process.env.JWT_SECRET || "adminsecret");
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }
    const admin = await AdminUser_default.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.admin = admin;
    req.user = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      isAdmin: true
    };
    console.log("Admin authenticated:", req.user.username);
    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};
var admin_auth_default2 = adminAuthMiddleware;

// server/models/OTP.ts
import mongoose11, { Schema as Schema9 } from "mongoose";
var OTPSchema = new Schema9({
  userId: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300
    // Document will be automatically deleted after 5 minutes
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  },
  lastAttemptAt: {
    type: Date
  },
  ipAddress: {
    type: String
  },
  deviceInfo: {
    type: String
  }
});
OTPSchema.index({ userId: 1, createdAt: 1 });
OTPSchema.index({ ipAddress: 1, createdAt: 1 });
var OTP_default = mongoose11.model("OTP", OTPSchema);

// server/services/otp-service.ts
var OTPService = class {
  constructor() {
    this.MAX_ATTEMPTS = 3;
    this.LOCKOUT_DURATION = 15 * 60 * 1e3;
  }
  // 15 minutes in milliseconds
  // Generate a 6-digit OTP
  generateOTP() {
    return Math.floor(1e5 + Math.random() * 9e5).toString();
  }
  // Create and save new OTP
  async createOTP(userId, options) {
    try {
      const lastFailedAttempt = await OTP_default.findOne({
        userId,
        isUsed: false,
        attempts: { $gte: this.MAX_ATTEMPTS },
        lastAttemptAt: { $gt: new Date(Date.now() - this.LOCKOUT_DURATION) }
      });
      if (lastFailedAttempt?.lastAttemptAt) {
        const lockoutRemaining = Math.ceil(
          (this.LOCKOUT_DURATION - (Date.now() - lastFailedAttempt.lastAttemptAt.getTime())) / 1e3 / 60
        );
        throw new Error(`Account is locked. Try again in ${lockoutRemaining} minutes`);
      }
      await OTP_default.deleteMany({ userId, isUsed: false });
      const otp = this.generateOTP();
      const expiresAt = /* @__PURE__ */ new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);
      const otpDoc = await OTP_default.create({
        userId,
        otp,
        expiresAt,
        createdAt: /* @__PURE__ */ new Date(),
        ipAddress: options?.ipAddress,
        deviceInfo: options?.deviceInfo
      });
      console.log(`OTP for user ${userId}: ${otp}`);
      console.log(`OTP will expire at: ${expiresAt.toISOString()}`);
      return otp;
    } catch (error) {
      console.error("Error generating OTP:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate OTP: ${error.message}`);
      }
      throw new Error("Failed to generate OTP: Unknown error");
    }
  }
  // Verify OTP
  async verifyOTP(userId, otpToVerify, options) {
    try {
      const lastFailedAttempt = await OTP_default.findOne({
        userId,
        isUsed: false,
        attempts: { $gte: this.MAX_ATTEMPTS },
        lastAttemptAt: { $gt: new Date(Date.now() - this.LOCKOUT_DURATION) }
      });
      if (lastFailedAttempt?.lastAttemptAt) {
        const lockoutRemaining = Math.ceil(
          (this.LOCKOUT_DURATION - (Date.now() - lastFailedAttempt.lastAttemptAt.getTime())) / 1e3 / 60
        );
        throw new Error(`Account is locked. Try again in ${lockoutRemaining} minutes`);
      }
      const otpRecord = await OTP_default.findOne({
        userId,
        otp: otpToVerify,
        isUsed: false,
        expiresAt: { $gt: /* @__PURE__ */ new Date() }
      });
      if (!otpRecord) {
        const expiredOTP = await OTP_default.findOne({
          userId,
          otp: otpToVerify,
          isUsed: false,
          expiresAt: { $lte: /* @__PURE__ */ new Date() }
        });
        if (expiredOTP) {
          console.log(`OTP expired for user ${userId}. Expired at: ${expiredOTP.expiresAt}`);
          throw new Error("OTP has expired");
        }
        const existingOTP = await OTP_default.findOne({ userId, isUsed: false });
        if (existingOTP) {
          existingOTP.attempts += 1;
          existingOTP.lastAttemptAt = /* @__PURE__ */ new Date();
          existingOTP.ipAddress = options?.ipAddress;
          existingOTP.deviceInfo = options?.deviceInfo;
          await existingOTP.save();
          if (existingOTP.attempts >= this.MAX_ATTEMPTS) {
            throw new Error(`Maximum attempts exceeded. Account is locked for ${this.LOCKOUT_DURATION / 1e3 / 60} minutes`);
          }
        }
        console.log(`Invalid OTP attempt for user ${userId}`);
        return false;
      }
      otpRecord.isUsed = true;
      otpRecord.ipAddress = options?.ipAddress;
      otpRecord.deviceInfo = options?.deviceInfo;
      await otpRecord.save();
      console.log(`OTP verified successfully for user ${userId}`);
      return true;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (error instanceof Error && (error.message === "OTP has expired" || error.message.includes("Account is locked") || error.message.includes("Maximum attempts exceeded"))) {
        throw error;
      }
      throw new Error("Failed to verify OTP");
    }
  }
};
var otpService = new OTPService();

// server/middleware/rate-limit.ts
import rateLimit from "express-rate-limit";
var otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1e3,
  // 5 minutes
  max: 3,
  message: { message: "Too many OTP requests. Please try again later." }
});
var otpVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 5,
  message: { message: "Too many verification attempts. Please try again later." }
});
var passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 5,
  message: { message: "Too many login attempts. Please try again later." }
});

// server/routes/password-auth.ts
init_User();
import { Router } from "express";
import { z as z2 } from "zod";

// server/services/migration-service.ts
init_User();
var MIGRATION_DEADLINE_DAYS = 30;
var REMINDER_INTERVALS = [7, 3, 1];
var MigrationService = class {
  /**
   * Start migration process for a user
   */
  static async startMigration(userId) {
    const user = await User_default.findById(userId);
    if (!user || !user.hasPassword) return;
    const scheduledDeletionDate = /* @__PURE__ */ new Date();
    scheduledDeletionDate.setDate(scheduledDeletionDate.getDate() + MIGRATION_DEADLINE_DAYS);
    user.migrationStatus = {
      notifiedAt: /* @__PURE__ */ new Date(),
      reminderCount: 0,
      scheduledDeletionDate
    };
    await user.save();
    return user;
  }
  /**
   * Process reminders for all users in migration
   */
  static async processReminders() {
    const users = await User_default.find({
      hasPassword: true,
      "migrationStatus.scheduledDeletionDate": { $exists: true }
    });
    for (const user of users) {
      if (!user.migrationStatus?.scheduledDeletionDate) continue;
      const daysUntilDeletion = Math.ceil(
        (user.migrationStatus.scheduledDeletionDate.getTime() - Date.now()) / (1e3 * 60 * 60 * 24)
      );
      if (REMINDER_INTERVALS.includes(daysUntilDeletion)) {
        if (daysUntilDeletion !== user.migrationStatus.reminderCount) {
          console.log(`Sending reminder to ${user.username}. ${daysUntilDeletion} days remaining.`);
          user.migrationStatus.reminderCount++;
          user.migrationStatus.lastReminder = /* @__PURE__ */ new Date();
          await user.save();
        }
      }
    }
  }
  /**
   * Remove password authentication for users past deadline
   */
  static async processPasswordDeletion() {
    const users = await User_default.find({
      hasPassword: true,
      "migrationStatus.scheduledDeletionDate": { $lt: /* @__PURE__ */ new Date() }
    });
    for (const user of users) {
      user.password = void 0;
      user.hasPassword = false;
      user.preferredAuthMethod = "otp";
      user.migrationStatus = void 0;
      await user.save();
      console.log(`Completed migration for user: ${user.username}`);
    }
  }
  /**
   * Get migration status for a user
   */
  static async getMigrationStatus(userId) {
    const user = await User_default.findById(userId);
    if (!user || !user.migrationStatus) return null;
    const daysRemaining = user.migrationStatus.scheduledDeletionDate ? Math.ceil((user.migrationStatus.scheduledDeletionDate.getTime() - Date.now()) / (1e3 * 60 * 60 * 24)) : null;
    return {
      startedAt: user.migrationStatus.notifiedAt,
      daysRemaining,
      remindersSent: user.migrationStatus.reminderCount,
      lastReminder: user.migrationStatus.lastReminder,
      scheduledDeletionDate: user.migrationStatus.scheduledDeletionDate
    };
  }
};

// server/routes/password-auth.ts
var router2 = Router();
var passwordSchema = z2.object({
  password: z2.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z2.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
router2.post("/setup-password", async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "You must be logged in to set up a password" });
    }
    res.set("Warning", "Password authentication is being deprecated. Please consider using OTP authentication.");
    const { password, confirmPassword } = passwordSchema.parse(req.body);
    const user = await User_default.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = password;
    user.preferredAuthMethod = "password";
    await user.save();
    await MigrationService.startMigration(user.id);
    const migrationStatus = await MigrationService.getMigrationStatus(user.id);
    res.json({
      message: "Password set successfully, but please note that password authentication is being deprecated",
      preferredAuthMethod: user.preferredAuthMethod,
      migrationStatus,
      warning: "Password authentication will be removed soon. Please migrate to OTP authentication."
    });
  } catch (error) {
    if (error instanceof z2.ZodError) {
      return res.status(400).json({
        message: "Invalid password format",
        errors: error.errors
      });
    }
    console.error("Error setting up password:", error);
    res.status(500).json({ message: "Failed to set up password" });
  }
});
router2.post("/login", passwordLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    res.set("Warning", "Password authentication is being deprecated. Please consider using OTP authentication.");
    const user = await User_default.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.hasPassword) {
      return res.status(401).json({ message: "Password login not enabled for this account" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    user.lastLogin = /* @__PURE__ */ new Date();
    const deviceInfo = {
      ipAddress: req.ip || req.socket.remoteAddress || "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
      lastUsed: /* @__PURE__ */ new Date()
    };
    if (!user.deviceInfo) {
      user.deviceInfo = { lastDevices: [deviceInfo] };
    } else {
      user.deviceInfo.lastDevices.unshift(deviceInfo);
      if (user.deviceInfo.lastDevices.length > 5) {
        user.deviceInfo.lastDevices = user.deviceInfo.lastDevices.slice(0, 5);
      }
    }
    await user.save();
    const migrationStatus = await MigrationService.getMigrationStatus(user.id);
    req.login(user, (err) => {
      if (err) {
        console.error("Session creation error:", err);
        return res.status(500).json({ message: "Error creating session" });
      }
      const safeUser = {
        id: user.id,
        username: user.username,
        preferredAuthMethod: user.preferredAuthMethod,
        createdAt: user.createdAt,
        migrationStatus,
        warning: "Password authentication will be removed soon. Please migrate to OTP authentication."
      };
      res.json(safeUser);
    });
  } catch (error) {
    console.error("Password login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});
router2.post("/change-auth-method", async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "You must be logged in to change auth method" });
    }
    const { method } = req.body;
    if (!["password", "otp"].includes(method)) {
      return res.status(400).json({ message: "Invalid authentication method" });
    }
    if (method === "password") {
      res.set("Warning", "Password authentication is being deprecated. Please consider using OTP authentication.");
    }
    const user = await User_default.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (method === "password") {
      if (!user.hasPassword) {
        return res.status(400).json({ message: "You must set up a password first" });
      }
      await MigrationService.startMigration(user.id);
    }
    user.preferredAuthMethod = method;
    await user.save();
    const migrationStatus = method === "password" ? await MigrationService.getMigrationStatus(user.id) : null;
    res.json({
      message: method === "password" ? "Authentication method updated. Note: Password authentication will be deprecated soon." : "Authentication method updated successfully",
      preferredAuthMethod: user.preferredAuthMethod,
      migrationStatus,
      warning: method === "password" ? "Password authentication will be removed soon. Please consider using OTP authentication." : void 0
    });
  } catch (error) {
    console.error("Error changing auth method:", error);
    res.status(500).json({ message: "Failed to change authentication method" });
  }
});
var password_auth_default = router2;

// server/routes.ts
console.log("Using storage implementation:", storage.constructor.name);
var isAdmin = (req, res, next) => {
  console.log("=== isAdmin middleware called ===");
  if (!req.user) {
    console.log("isAdmin check failed: No user object in request");
    return res.status(401).json({
      error: "Unauthorized",
      detail: "No authenticated user found"
    });
  }
  if (!req.user.id) {
    console.log("isAdmin check failed: User object has no ID");
    return res.status(401).json({
      error: "Unauthorized",
      detail: "Invalid user information"
    });
  }
  console.log(`User ID in request: ${req.user.id}`);
  console.log(`Admin status: ${req.user.isAdmin}`);
  if (req.user.isAdmin === true) {
    console.log("User has isAdmin=true, granting access");
    next();
  } else {
    console.log("User isAdmin=false, denying access");
    return res.status(403).json({
      error: "Forbidden - Admin access required",
      detail: "Current user does not have admin privileges"
    });
  }
};
function getDeviceInfo(req) {
  const ipAddress = req.ip || req.socket.remoteAddress || "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";
  return {
    ipAddress,
    deviceInfo: userAgent
  };
}
async function registerRoutes(app) {
  setupAuth(app, storage);
  app.use("/api/auth/password", password_auth_default);
  const PORT = process.env.PORT || 3e3;
  app.use("/api/admin-auth", admin_auth_default);
  app.use("/api/admin", admin_auth_default2);
  app.post("/api/admin/subcategories", async (req, res) => {
    try {
      console.log("=== Creating subcategory via admin API ===");
      console.log("Request body:", req.body);
      console.log("User:", req.user ? `ID: ${req.user.id}, isAdmin: ${req.user.isAdmin}` : "No user");
      const subcategoryData = insertSubcategorySchema.parse(req.body);
      console.log("Validated subcategory data:", subcategoryData);
      const subcategory = await storage.createSubcategory(subcategoryData);
      console.log("Subcategory created successfully via admin API:", subcategory);
      res.status(201).json(subcategory);
    } catch (error) {
      console.error("Error creating subcategory via admin API:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid subcategory data" });
      }
    }
  });
  app.put("/api/admin/subcategories/:id", async (req, res) => {
    try {
      console.log(`=== Updating subcategory via admin API: ${req.params.id} ===`);
      console.log("Update data:", req.body);
      console.log("User:", req.user ? `ID: ${req.user.id}, isAdmin: ${req.user.isAdmin}` : "No user");
      const subcategoryData = updateSubcategorySchema.parse(req.body);
      const subcategory = await storage.updateSubcategory(req.params.id, subcategoryData);
      console.log("Subcategory updated successfully via admin API:", subcategory);
      res.json(subcategory);
    } catch (error) {
      console.error(`Error updating subcategory ${req.params.id} via admin API:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid subcategory data" });
      }
    }
  });
  app.delete("/api/admin/subcategories/:id", async (req, res) => {
    try {
      console.log(`=== Deleting subcategory via admin API: ${req.params.id} ===`);
      console.log("User:", req.user ? `ID: ${req.user.id}, isAdmin: ${req.user.isAdmin}` : "No user");
      const success = await storage.deleteSubcategory(req.params.id);
      if (success) {
        console.log("Subcategory deleted successfully via admin API");
        res.status(204).end();
      } else {
        console.log("Subcategory not found via admin API");
        res.status(404).json({ error: "Subcategory not found" });
      }
    } catch (error) {
      console.error(`Error deleting subcategory ${req.params.id} via admin API:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete subcategory" });
      }
    }
  });
  app.post("/api/complaints", async (req, res) => {
    try {
      const complaintData = insertComplaintSchema.parse(req.body);
      const complaint = await storage.createComplaint(complaintData);
      res.json(complaint);
    } catch (error) {
      res.status(400).json({ error: "Invalid complaint data" });
    }
  });
  app.get("/api/blog-posts", async (_req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
  app.post("/api/categories/clear", async (req, res) => {
    try {
      console.log("Clearing all categories");
      const subcategories = await storage.getSubcategories();
      console.log(`Found ${subcategories.length} subcategories to delete first`);
      for (const subcategory of subcategories) {
        if (subcategory.id) {
          console.log(`Deleting subcategory: ${subcategory.id}`);
          try {
            await storage.deleteSubcategory(subcategory.id);
          } catch (subError) {
            console.warn(`Warning: Could not delete subcategory ${subcategory.id}: ${subError instanceof Error ? subError.message : "Unknown error"}`);
          }
        }
      }
      const categories = await storage.getCategories();
      console.log(`Found ${categories.length} categories to delete`);
      let successCount = 0;
      let errorCount = 0;
      for (const category of categories) {
        if (category.id) {
          try {
            console.log(`Deleting category: ${category.id}`);
            await storage.deleteCategory(category.id);
            successCount++;
          } catch (catError) {
            console.error(`Error deleting category ${category.id}: ${catError instanceof Error ? catError.message : "Unknown error"}`);
            errorCount++;
          }
        }
      }
      res.status(200).json({
        message: "Categories clearing operation completed",
        details: {
          subcategoriesDeleted: subcategories.length,
          categoriesDeleted: successCount,
          categoriesFailed: errorCount
        }
      });
    } catch (error) {
      console.error("Error clearing categories:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to clear categories" });
      }
    }
  });
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategoryById(req.params.id);
      res.json(category);
    } catch (error) {
      console.error(`Error fetching category ${req.params.id}:`, error);
      res.status(404).json({ error: "Category not found" });
    }
  });
  app.post("/api/categories", async (req, res) => {
    try {
      console.log("Creating category with data:", req.body);
      const categoryData = insertCategorySchema.parse(req.body);
      console.log("Validated category data:", categoryData);
      console.log("Storage implementation:", storage.constructor.name);
      const category = await storage.createCategory(categoryData);
      console.log("Category created successfully:", category);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid category data" });
      }
    }
  });
  app.put("/api/categories/:id", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const categoryData = updateCategorySchema.parse(req.body);
      const category = await storage.updateCategory(req.params.id, categoryData);
      res.json(category);
    } catch (error) {
      console.error(`Error updating category ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid category data" });
      }
    }
  });
  app.delete("/api/categories/:id", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const success = await storage.deleteCategory(req.params.id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      console.error(`Error deleting category ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete category" });
      }
    }
  });
  app.get("/api/subcategories", async (req, res) => {
    try {
      let subcategories;
      if (req.query.categoryId) {
        subcategories = await storage.getSubcategoriesByCategory(req.query.categoryId);
      } else {
        subcategories = await storage.getSubcategories();
      }
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ error: "Failed to fetch subcategories" });
    }
  });
  app.get("/api/subcategories/:id", async (req, res) => {
    try {
      const subcategory = await storage.getSubcategoryById(req.params.id);
      res.json(subcategory);
    } catch (error) {
      console.error(`Error fetching subcategory ${req.params.id}:`, error);
      res.status(404).json({ error: "Subcategory not found" });
    }
  });
  app.post("/api/subcategories", isAdmin, async (req, res) => {
    try {
      console.log("=== Creating subcategory ===");
      console.log("Request headers:", req.headers);
      console.log("Request body:", req.body);
      console.log("User:", req.user ? `ID: ${req.user.id}, isAdmin: ${req.user.isAdmin}` : "No user");
      const subcategoryData = insertSubcategorySchema.parse(req.body);
      console.log("Validated subcategory data:", subcategoryData);
      const subcategory = await storage.createSubcategory(subcategoryData);
      console.log("Subcategory created successfully:", subcategory);
      res.status(201).json(subcategory);
    } catch (error) {
      console.error("Error creating subcategory:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid subcategory data" });
      }
    }
  });
  app.put("/api/subcategories/:id", isAdmin, async (req, res) => {
    try {
      console.log(`Updating subcategory with ID: ${req.params.id}`);
      console.log("Update data:", req.body);
      const subcategoryData = updateSubcategorySchema.parse(req.body);
      const subcategory = await storage.updateSubcategory(req.params.id, subcategoryData);
      console.log("Subcategory updated successfully:", subcategory);
      res.json(subcategory);
    } catch (error) {
      console.error(`Error updating subcategory ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid subcategory data" });
      }
    }
  });
  app.delete("/api/subcategories/:id", isAdmin, async (req, res) => {
    try {
      console.log(`Deleting subcategory with ID: ${req.params.id}`);
      const success = await storage.deleteSubcategory(req.params.id);
      if (success) {
        console.log("Subcategory deleted successfully");
        res.status(204).end();
      } else {
        console.log("Subcategory not found");
        res.status(404).json({ error: "Subcategory not found" });
      }
    } catch (error) {
      console.error(`Error deleting subcategory ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete subcategory" });
      }
    }
  });
  app.get("/api/db-check", async (_req, res) => {
    try {
      const dbName = mongoose15.connection.db?.databaseName;
      const collections = await mongoose15.connection.db?.listCollections().toArray() || [];
      const collectionNames = collections.map((c) => c.name);
      const collectionStats = {};
      for (const name of collectionNames) {
        const count = await mongoose15.connection.db?.collection(name).countDocuments() || 0;
        collectionStats[name] = count;
      }
      const hasCategories = collectionNames.includes("categories");
      const hasSubcategories = collectionNames.includes("subcategories");
      let categories = [];
      let subcategories = [];
      if (hasCategories) {
        categories = await mongoose15.connection.db?.collection("categories").find({}).toArray() || [];
      }
      if (hasSubcategories) {
        subcategories = await mongoose15.connection.db?.collection("subcategories").find({}).toArray() || [];
      }
      res.json({
        databaseName: dbName,
        collections: collectionNames,
        collectionStats,
        hasCategories,
        hasSubcategories,
        categories,
        subcategories,
        connectionString: process.env.MONGODB_URI ? "Using environment variable" : "Using default connection string"
      });
    } catch (error) {
      console.error("Error checking database:", error);
      res.status(500).json({
        error: "Failed to check database",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace available"
      });
    }
  });
  app.get("/api/direct-db-check", async (_req, res) => {
    try {
      const modelNames = mongoose15.modelNames();
      const connectionState = mongoose15.connection.readyState;
      const connectionStates = ["disconnected", "connected", "connecting", "disconnecting"];
      let testCategory = null;
      let error = null;
      try {
        testCategory = new Category({ name: `Test Category ${Date.now()}` });
        await testCategory.save();
      } catch (err) {
        error = {
          message: err instanceof Error ? err.message : "Unknown error",
          stack: err instanceof Error ? err.stack : "No stack trace available",
          code: err instanceof Error && "code" in err ? err.code : "unknown"
        };
      }
      const dbName = mongoose15.connection.db ? mongoose15.connection.db.databaseName : "Not connected";
      let collections = [];
      try {
        if (mongoose15.connection.db) {
          collections = await mongoose15.connection.db.listCollections().toArray();
        }
      } catch (err) {
        console.error("Error listing collections:", err);
      }
      let categories = [];
      try {
        categories = await Category.find().lean();
      } catch (err) {
        console.error("Error finding categories:", err);
      }
      res.json({
        connectionState: {
          code: connectionState,
          description: connectionStates[connectionState]
        },
        registeredModels: modelNames,
        categoryModelRegistered: modelNames.includes("Category"),
        databaseName: dbName,
        collections: collections.map((c) => c.name),
        testCategory: testCategory ? testCategory.toJSON() : null,
        testCategoryError: error,
        categories,
        mongooseVersion: mongoose15.version
      });
    } catch (error) {
      console.error("Error in direct DB check:", error);
      res.status(500).json({
        error: "Failed to perform direct DB check",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace available"
      });
    }
  });
  app.get("/api/test-create-category", async (_req, res) => {
    try {
      console.log("Test creating a category");
      const testCategory = {
        name: `Test Category ${Date.now()}`,
        number: Math.floor(Math.random() * 1e3)
        // Adding a number property 
      };
      console.log("Creating test category:", testCategory);
      const category = await storage.createCategory(testCategory);
      console.log("Test category created:", category);
      res.json({
        success: true,
        message: "Test category created successfully",
        category
      });
    } catch (error) {
      console.error("Error creating test category:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create test category",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace available"
      });
    }
  });
  app.get("/api/appservices", async (_req, res) => {
    try {
      const { AppService: AppService2 } = await Promise.resolve().then(() => (init_AppService(), AppService_exports));
      const appServices = await AppService2.find().lean();
      console.log("AppServices from database (count):", appServices.length);
      const formattedServices = appServices.map((service) => {
        const id = service._id.toString();
        return {
          ...service,
          id
        };
      });
      res.json(formattedServices);
    } catch (error) {
      console.error("Error fetching app services:", error);
      res.status(500).json({ error: "Failed to fetch app services" });
    }
  });
  app.post("/api/appservices", async (req, res) => {
    try {
      console.log("Creating app service with data:", req.body);
      const { AppService: AppService2 } = await Promise.resolve().then(() => (init_AppService(), AppService_exports));
      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
      }
      const newService = new AppService2({
        title,
        description,
        icon: req.body.icon,
        category: req.body.category,
        subcategoryIds: req.body.subcategoryIds,
        features: req.body.features,
        eligibility: req.body.eligibility,
        process: req.body.process,
        documents: req.body.documents,
        faqs: req.body.faqs,
        contactInfo: req.body.contactInfo
      });
      await newService.save();
      console.log("App service created successfully:", newService.toJSON());
      res.status(201).json(newService.toJSON());
    } catch (error) {
      console.error("Error creating app service:", error);
      res.status(500).json({
        error: "Failed to create app service",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app.get("/api/appservices/:id", async (req, res) => {
    try {
      const { AppService: AppService2 } = await Promise.resolve().then(() => (init_AppService(), AppService_exports));
      const appService = await AppService2.findById(req.params.id).lean();
      if (!appService) {
        return res.status(404).json({ error: "App service not found" });
      }
      const formattedService = {
        ...appService,
        id: appService._id.toString()
      };
      res.json(formattedService);
    } catch (error) {
      console.error(`Error fetching app service ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch app service" });
    }
  });
  app.put("/api/appservices/:id", async (req, res) => {
    try {
      console.log(`Updating app service with ID: ${req.params.id}`);
      const { AppService: AppService2 } = await Promise.resolve().then(() => (init_AppService(), AppService_exports));
      const updatedService = await AppService2.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: /* @__PURE__ */ new Date() },
        { new: true, runValidators: true }
      );
      if (!updatedService) {
        return res.status(404).json({ error: "App service not found" });
      }
      console.log("App service updated successfully:", updatedService.toJSON());
      res.json(updatedService.toJSON());
    } catch (error) {
      console.error(`Error updating app service ${req.params.id}:`, error);
      res.status(500).json({
        error: "Failed to update app service",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app.delete("/api/appservices/:id", async (req, res) => {
    try {
      console.log(`Deleting app service with ID: ${req.params.id}`);
      const { AppService: AppService2 } = await Promise.resolve().then(() => (init_AppService(), AppService_exports));
      const result = await AppService2.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "App service not found" });
      }
      console.log("App service deleted successfully");
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting app service ${req.params.id}:`, error);
      res.status(500).json({
        error: "Failed to delete app service",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app.get("/api/services", async (_req, res) => {
    try {
      const { Service: Service2 } = await Promise.resolve().then(() => (init_Service(), Service_exports));
      const services = await Service2.find().lean();
      console.log("Services from database (count):", services.length);
      if (services.length === 0) {
        console.log("No services found in database");
      } else {
        console.log("First service from database:", services[0]);
      }
      const formattedServices = services.map((service) => {
        const id = service._id ? service._id.toString() : "";
        return {
          ...service,
          id
        };
      });
      console.log("Formatted services (count):", formattedServices.length);
      if (formattedServices.length > 0) {
        console.log("First formatted service:", formattedServices[0]);
      }
      res.json(formattedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });
  app.post("/api/services", async (req, res) => {
    try {
      console.log("Creating service with data:", req.body);
      const { Service: Service2 } = await Promise.resolve().then(() => (init_Service(), Service_exports));
      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
      }
      const newService = new Service2({
        title,
        description,
        icon: req.body.icon || "\u{1F4C4}",
        // Default icon
        features: req.body.features || ["New service"],
        eligibility: req.body.eligibility || ["Everyone is eligible"],
        process: req.body.process || [{
          title: "Simple Process",
          steps: ["Contact us to get started"]
        }],
        documents: req.body.documents || ["No documents required"],
        faqs: req.body.faqs || [{
          question: "How do I get started?",
          answer: "Contact us to learn more about this service."
        }],
        contactInfo: req.body.contactInfo || {
          phone: "123-456-7890",
          email: "contact@example.com"
        },
        category: req.body.category || "general",
        subcategoryIds: req.body.subcategoryIds || []
      });
      await newService.save();
      console.log("Service created successfully:", newService.toJSON());
      if (req.body.subcategoryIds && req.body.subcategoryIds.length > 0) {
        const { Subcategory: Subcategory2 } = await Promise.resolve().then(() => (init_Subcategory(), Subcategory_exports));
        console.log(`Updating ${req.body.subcategoryIds.length} subcategories with this service ID`);
        const serviceId = newService._id ? newService._id.toString() : "";
        for (const subcategoryId of req.body.subcategoryIds) {
          const subcategory = await Subcategory2.findById(subcategoryId);
          if (subcategory) {
            if (!subcategory.serviceIds.includes(serviceId)) {
              subcategory.serviceIds.push(serviceId);
              await subcategory.save();
              console.log(`Added service ID ${serviceId} to subcategory ${subcategoryId}`);
            }
          }
        }
      }
      res.status(201).json(newService.toJSON());
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({
        error: "Failed to create service",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app.get("/api/test-create-service", async (_req, res) => {
    try {
      console.log("Test creating a service");
      const { Service: Service2 } = await Promise.resolve().then(() => (init_Service(), Service_exports));
      const serviceCount = await Service2.countDocuments();
      console.log("Current service count:", serviceCount);
      const testService = new Service2({
        title: `Test Service ${Date.now()}`,
        icon: "\u{1F50D}",
        description: "This is a test service created for demonstration purposes.",
        features: ["Feature 1", "Feature 2", "Feature 3"],
        eligibility: ["Anyone can use this service"],
        process: [{
          title: "Simple Process",
          steps: ["Step 1", "Step 2", "Step 3"]
        }],
        documents: ["No documents required"],
        faqs: [{
          question: "What is this service?",
          answer: "This is a test service created for demonstration purposes."
        }],
        contactInfo: {
          phone: "123-456-7890",
          email: "test@example.com"
        }
      });
      await testService.save();
      console.log("Test service created:", testService.toJSON());
      res.json({
        success: true,
        message: "Test service created successfully",
        service: testService.toJSON()
      });
    } catch (error) {
      console.error("Error creating test service:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create test service",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace available"
      });
    }
  });
  app.get("/api/services/:id", async (req, res) => {
    try {
      const { Service: Service2 } = await Promise.resolve().then(() => (init_Service(), Service_exports));
      const service = await Service2.findById(req.params.id).lean();
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      const formattedService = {
        ...service,
        id: service._id.toString()
      };
      console.log(`Service ${req.params.id} fetched successfully`);
      res.json(formattedService);
    } catch (error) {
      console.error(`Error fetching service ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });
  app.put("/api/services/:id", async (req, res) => {
    try {
      console.log(`Updating service with ID: ${req.params.id}`);
      console.log("Update data:", req.body);
      const { Service: Service2 } = await Promise.resolve().then(() => (init_Service(), Service_exports));
      const { Subcategory: Subcategory2 } = await Promise.resolve().then(() => (init_Subcategory(), Subcategory_exports));
      const currentService = await Service2.findById(req.params.id);
      if (!currentService) {
        return res.status(404).json({ error: "Service not found" });
      }
      const oldSubcategoryIds = currentService.subcategoryIds || [];
      const newSubcategoryIds = req.body.subcategoryIds || [];
      const updatedService = await Service2.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: /* @__PURE__ */ new Date() },
        { new: true, runValidators: true }
      );
      if (!updatedService) {
        return res.status(404).json({ error: "Service not found" });
      }
      const serviceId = updatedService._id ? updatedService._id.toString() : "";
      const removedSubcategoryIds = oldSubcategoryIds.filter((id) => !newSubcategoryIds.includes(id));
      for (const subcategoryId of removedSubcategoryIds) {
        const subcategory = await Subcategory2.findById(subcategoryId);
        if (subcategory) {
          subcategory.serviceIds = subcategory.serviceIds.filter((id) => id !== serviceId);
          await subcategory.save();
          console.log(`Removed service ID ${serviceId} from subcategory ${subcategoryId}`);
        }
      }
      const addedSubcategoryIds = newSubcategoryIds.filter((id) => !oldSubcategoryIds.includes(id));
      for (const subcategoryId of addedSubcategoryIds) {
        const subcategory = await Subcategory2.findById(subcategoryId);
        if (subcategory) {
          if (!subcategory.serviceIds.includes(serviceId)) {
            subcategory.serviceIds.push(serviceId);
            await subcategory.save();
            console.log(`Added service ID ${serviceId} to subcategory ${subcategoryId}`);
          }
        }
      }
      console.log("Service updated successfully:", updatedService.toJSON());
      res.json(updatedService.toJSON());
    } catch (error) {
      console.error(`Error updating service ${req.params.id}:`, error);
      res.status(500).json({
        error: "Failed to update service",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app.delete("/api/services/:id", async (req, res) => {
    try {
      console.log(`Deleting service with ID: ${req.params.id}`);
      const { Service: Service2 } = await Promise.resolve().then(() => (init_Service(), Service_exports));
      const { Subcategory: Subcategory2 } = await Promise.resolve().then(() => (init_Subcategory(), Subcategory_exports));
      const service = await Service2.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      if (service.subcategoryIds && service.subcategoryIds.length > 0) {
        const serviceId = service._id.toString();
        for (const subcategoryId of service.subcategoryIds) {
          const subcategory = await Subcategory2.findById(subcategoryId);
          if (subcategory) {
            subcategory.serviceIds = subcategory.serviceIds.filter((id) => id !== serviceId);
            await subcategory.save();
            console.log(`Removed service ID ${serviceId} from subcategory ${subcategoryId}`);
          }
        }
      }
      await Service2.deleteOne({ _id: req.params.id });
      console.log(`Service ${req.params.id} deleted successfully`);
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting service ${req.params.id}:`, error);
      res.status(500).json({
        error: "Failed to delete service",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app.get("/test-categories", async (_req, res) => {
    import("path").then((path4) => {
      res.sendFile(path4.default.join(__dirname, "test-category-form.html"));
    }).catch((error) => {
      console.error("Error importing path module:", error);
      res.status(500).send("Error serving test form");
    });
  });
  app.post("/api/tickets", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      console.log("Creating ticket with data:", req.body);
      const { Ticket: Ticket2 } = await Promise.resolve().then(() => (init_Ticket(), Ticket_exports));
      const { serviceId, serviceName } = req.body;
      if (!serviceId || !serviceName) {
        return res.status(400).json({ error: "Service ID and name are required" });
      }
      const newTicket = new Ticket2({
        serviceId,
        serviceName,
        userId: req.user.id,
        title: req.body.title || `${serviceName} Service Request`,
        // Default title if not provided
        description: req.body.description || `Request for ${serviceName} service.`,
        // Default description if not provided
        status: req.body.status || "new",
        priority: req.body.priority || "medium",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      await newTicket.save();
      console.log("Ticket created successfully:", newTicket.toJSON());
      if (req.app.locals.broadcastNotification) {
        req.app.locals.broadcastNotification({
          type: "notification",
          message: `New ticket created: ${newTicket.title}`,
          notificationType: "info",
          taskId: newTicket._id.toString()
        });
      }
      res.status(201).json(newTicket.toJSON());
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({
        error: "Failed to create ticket",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app.get("/api/tickets", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { Ticket: Ticket2 } = await Promise.resolve().then(() => (init_Ticket(), Ticket_exports));
      const tickets = await Ticket2.find({ userId: req.user.id }).lean();
      console.log(`Found ${tickets.length} tickets for user ${req.user.id}`);
      const formattedTickets = tickets.map((ticket) => ({
        ...ticket,
        id: ticket._id.toString()
      }));
      res.json(formattedTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });
  app.get("/api/tickets/:id", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { Ticket: Ticket2 } = await Promise.resolve().then(() => (init_Ticket(), Ticket_exports));
      const ticket = await Ticket2.findOne({
        _id: req.params.id,
        userId: req.user.id
      }).lean();
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      const formattedTicket = {
        ...ticket,
        id: ticket._id.toString()
      };
      res.json(formattedTicket);
    } catch (error) {
      console.error(`Error fetching ticket ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch ticket" });
    }
  });
  app.delete("/api/tickets/:id", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      console.log(`User ${req.user.id} attempting to delete ticket ${req.params.id}`);
      const { Ticket: Ticket2 } = await Promise.resolve().then(() => (init_Ticket(), Ticket_exports));
      const ticket = await Ticket2.findOne({
        _id: req.params.id,
        userId: req.user.id
      });
      if (!ticket) {
        console.log(`Ticket ${req.params.id} not found or doesn't belong to user ${req.user.id}`);
        return res.status(404).json({ error: "Ticket not found" });
      }
      await Ticket2.deleteOne({ _id: req.params.id });
      console.log(`Ticket ${req.params.id} successfully deleted by user ${req.user.id}`);
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting ticket ${req.params.id}:`, error);
      res.status(500).json({
        error: "Failed to delete ticket",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app.get("/api/tickets/:id/tasks", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { Ticket: Ticket2 } = await Promise.resolve().then(() => (init_Ticket(), Ticket_exports));
      const { Task: Task2 } = await Promise.resolve().then(() => (init_Task(), Task_exports));
      const { TaskView: TaskView2 } = await Promise.resolve().then(() => (init_TaskView(), TaskView_exports));
      const ticket = await Ticket2.findOne({
        _id: req.params.id,
        userId: req.user.id
      });
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      const tasks = await Task2.find({ ticketId: req.params.id }).lean();
      const viewedTasks = await TaskView2.find({
        userId: req.user.id,
        taskId: { $in: tasks.map((task) => task._id) }
      }).lean();
      const viewedTaskIds = new Set(viewedTasks.map((view) => view.taskId.toString()));
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const tasksWithAssigneeInfo = await Promise.all(
        tasks.map(async (task) => {
          try {
            if (task.assigneeId) {
              const assignee = await User2.findById(task.assigneeId).lean();
              if (assignee) {
                return {
                  ...task,
                  id: task._id.toString(),
                  assigneeName: `${assignee.firstName} ${assignee.lastName}`,
                  viewed: viewedTaskIds.has(task._id.toString())
                };
              }
            }
            return {
              ...task,
              id: task._id.toString(),
              viewed: viewedTaskIds.has(task._id.toString())
            };
          } catch (err) {
            return {
              ...task,
              id: task._id.toString(),
              viewed: viewedTaskIds.has(task._id.toString())
            };
          }
        })
      );
      res.json(tasksWithAssigneeInfo);
    } catch (error) {
      console.error(`Error fetching tasks for ticket ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });
  app.post("/api/tasks/:taskId/view", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { TaskView: TaskView2 } = await Promise.resolve().then(() => (init_TaskView(), TaskView_exports));
      const { Task: Task2 } = await Promise.resolve().then(() => (init_Task(), Task_exports));
      const task = await Task2.findById(req.params.taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      await TaskView2.findOneAndUpdate(
        {
          userId: req.user.id,
          taskId: req.params.taskId
        },
        {
          $set: { viewedAt: /* @__PURE__ */ new Date() }
        },
        {
          upsert: true,
          new: true
        }
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking task as viewed:", error);
      res.status(500).json({ error: "Failed to mark task as viewed" });
    }
  });
  app.post("/api/tasks/viewed-status", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const taskIds = req.body.taskIds;
      if (!Array.isArray(taskIds)) {
        return res.status(400).json({ error: "taskIds must be an array" });
      }
      const { TaskView: TaskView2 } = await Promise.resolve().then(() => (init_TaskView(), TaskView_exports));
      const viewedTasks = await TaskView2.find({
        userId: req.user.id,
        taskId: { $in: taskIds }
      }).lean();
      const viewedTaskIds = viewedTasks.map((view) => view.taskId.toString());
      res.json({
        viewedTasks: taskIds.reduce((acc, taskId) => {
          acc[taskId] = viewedTaskIds.includes(taskId);
          return acc;
        }, {})
      });
    } catch (error) {
      console.error("Error fetching viewed status:", error);
      res.status(500).json({ error: "Failed to fetch viewed status" });
    }
  });
  app.post("/api/tasks/viewed-status/batch", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { taskIds } = req.body;
      if (!Array.isArray(taskIds)) {
        return res.status(400).json({ error: "taskIds must be an array" });
      }
      const { TaskView: TaskView2 } = await Promise.resolve().then(() => (init_TaskView(), TaskView_exports));
      const { Task: Task2 } = await Promise.resolve().then(() => (init_Task(), Task_exports));
      const tasks = await Task2.find({ _id: { $in: taskIds } });
      if (tasks.length !== taskIds.length) {
        return res.status(404).json({ error: "Some tasks not found" });
      }
      const operations = taskIds.map((taskId) => ({
        updateOne: {
          filter: { userId: req.user.id, taskId },
          update: { $set: { viewedAt: /* @__PURE__ */ new Date() } },
          upsert: true
        }
      }));
      await TaskView2.bulkWrite(operations);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking tasks as viewed in batch:", error);
      res.status(500).json({ error: "Failed to mark tasks as viewed" });
    }
  });
  app.get("/api/admin/tickets", isAdmin, async (req, res) => {
    try {
      console.log("=== Admin ticket fetch request received ===");
      console.log("User:", req.user ? `ID: ${req.user.id}, isAdmin: ${req.user.isAdmin}` : "No user");
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      console.log("Pagination:", { page, limit });
      const filter = {};
      if (req.query.status && req.query.status !== "all") filter.status = req.query.status;
      if (req.query.priority && req.query.priority !== "all") filter.priority = req.query.priority;
      if (req.query.userId) filter.userId = req.query.userId;
      if (req.query.serviceId) filter.serviceId = req.query.serviceId;
      console.log("Applied filters:", filter);
      if (mongoose15.connection.readyState !== 1) {
        console.error("MongoDB connection is not open. Current state:", mongoose15.connection.readyState);
        return res.status(500).json({
          error: "Database connection is not available",
          detail: "Database connection state: " + mongoose15.connection.readyState
        });
      }
      console.log("Calling storage.getTickets method");
      const result = await storage.getTickets(page, limit, filter);
      console.log(`Received ${result.tickets.length} tickets from storage`);
      const response = {
        tickets: result.tickets,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      };
      console.log("Sending response with pagination:", response.pagination);
      res.json(response);
    } catch (error) {
      console.error("Admin ticket fetch error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      res.status(500).json({
        error: "Failed to fetch tickets",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app.get("/api/admin/tickets/:id", isAdmin, async (req, res) => {
    try {
      console.log(`=== Admin fetch for specific ticket ${req.params.id} ===`);
      console.log("User:", req.user ? `ID: ${req.user.id}` : "No user");
      console.log("Fetching ticket with ID:", req.params.id);
      const ticket = await storage.getTicketById(req.params.id);
      console.log("Ticket fetched successfully:", ticket.id);
      let user = null;
      try {
        console.log("Fetching user for ticket, user ID:", ticket.userId);
        user = await storage.getUser(ticket.userId);
        console.log("User fetched successfully");
      } catch (userError) {
        console.error(`Error fetching user for ticket ${req.params.id}:`, userError);
        console.log("Continuing without user information");
      }
      console.log("Fetching tasks for ticket ID:", ticket.id);
      const tasks = await storage.getTasks(req.params.id);
      console.log(`Found ${tasks.length} tasks for this ticket`);
      const response = {
        ticket,
        user,
        tasks
      };
      console.log("Sending full ticket details response");
      res.json(response);
    } catch (error) {
      console.error(`Error fetching ticket ${req.params.id}:`, error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      const statusCode = error.message?.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        error: statusCode === 404 ? "Ticket not found" : "Failed to fetch ticket details",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        ticketId: req.params.id,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app.put("/api/admin/tickets/:id", isAdmin, async (req, res) => {
    try {
      const ticketData = updateTicketSchema.parse(req.body);
      const ticket = await storage.updateTicket(req.params.id, ticketData);
      res.json(ticket);
    } catch (error) {
      console.error(`Error updating ticket ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid ticket data" });
      }
    }
  });
  app.delete("/api/admin/tickets/:id", isAdmin, async (req, res) => {
    try {
      const success = await storage.deleteTicket(req.params.id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Ticket not found" });
      }
    } catch (error) {
      console.error(`Error deleting ticket ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete ticket" });
      }
    }
  });
  app.get("/api/admin/tickets/:id/tasks", isAdmin, async (req, res) => {
    try {
      const tasks = await storage.getTasks(req.params.id);
      res.json(tasks);
    } catch (error) {
      console.error(`Error fetching tasks for ticket ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });
  app.post("/api/admin/tickets/:id/tasks", isAdmin, async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse({
        ...req.body,
        ticketId: req.params.id
      });
      const task = await storage.createTask(taskData);
      if (req.app.locals.broadcastNotification) {
        req.app.locals.broadcastNotification({
          type: "notification",
          message: `New task assigned: ${task.title}`,
          notificationType: "info",
          taskId: task.id
        });
      }
      res.status(201).json(task);
    } catch (error) {
      console.error(`Error creating task for ticket ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid task data" });
      }
    }
  });
  app.put("/api/admin/tasks/:id", isAdmin, async (req, res) => {
    try {
      const taskData = updateTaskSchema.parse(req.body);
      const task = await storage.updateTask(req.params.id, taskData);
      res.json(task);
    } catch (error) {
      console.error(`Error updating task ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid task data" });
      }
    }
  });
  app.delete("/api/admin/tasks/:id", isAdmin, async (req, res) => {
    try {
      const success = await storage.deleteTask(req.params.id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    } catch (error) {
      console.error(`Error deleting task ${req.params.id}:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete task" });
      }
    }
  });
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const users = await User2.find({}, { password: 0 });
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        error: "Failed to fetch users",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const user = await User2.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ error: "Cannot delete your own admin account" });
      }
      await User2.deleteOne({ _id: req.params.id });
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        error: "Failed to delete user",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app.post("/api/auth/request-otp", otpLimiter, async (req, res) => {
    try {
      const { username } = req.body;
      const deviceInfo = getDeviceInfo(req);
      if (!username) {
        return res.status(400).json({
          message: "Username is required"
        });
      }
      let user = await storage.getUserByUsername(username);
      if (!user) {
        try {
          user = await storage.createUser({ username });
          console.log("New user created:", username);
        } catch (error) {
          console.error("User creation error:", error);
          return res.status(500).json({
            message: error instanceof Error ? error.message : "Error creating user"
          });
        }
      }
      try {
        const otp = await otpService.createOTP(user.id, deviceInfo);
        res.json({
          message: "OTP sent successfully",
          userId: user.id
        });
      } catch (error) {
        console.error("OTP generation error:", error);
        return res.status(500).json({
          message: error instanceof Error ? error.message : "Failed to generate OTP"
        });
      }
    } catch (error) {
      console.error("OTP request error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to send OTP"
      });
    }
  });
  app.post("/api/auth/verify-otp", otpVerificationLimiter, async (req, res) => {
    try {
      const { userId, otp } = req.body;
      const deviceInfo = getDeviceInfo(req);
      if (!userId || !otp) {
        return res.status(400).json({
          message: "User ID and OTP are required"
        });
      }
      try {
        const isValid = await otpService.verifyOTP(userId, otp, deviceInfo);
        if (!isValid) {
          return res.status(401).json({
            message: "Invalid OTP"
          });
        }
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(404).json({
            message: "User not found"
          });
        }
        req.login(user, (loginErr) => {
          if (loginErr) {
            console.error("Session creation error:", loginErr);
            return res.status(500).json({
              message: "Error creating session"
            });
          }
          const safeUser = {
            id: user.id,
            username: user.username,
            createdAt: user.createdAt
          };
          return res.json(safeUser);
        });
      } catch (error) {
        if (error instanceof Error && error.message === "OTP has expired") {
          return res.status(401).json({
            message: "OTP has expired"
          });
        }
        if (error instanceof Error && (error.message.includes("Account is locked") || error.message.includes("Maximum attempts exceeded"))) {
          return res.status(429).json({
            message: error.message
          });
        }
        throw error;
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to verify OTP"
      });
    }
  });
  return app;
}

// server/vite.ts
import express3 from "express";
import fs from "fs";
import path3, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname2 = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(__dirname2, "client", "src"),
      "@shared": path2.resolve(__dirname2, "shared")
    }
  },
  root: path2.resolve(__dirname2, "client"),
  build: {
    outDir: path2.resolve(__dirname2, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname3 = dirname2(__filename2);
var viteLogger = createLogger();
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname3,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = path3.resolve(__dirname3, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express3.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/websocket.ts
import { WebSocket, WebSocketServer } from "ws";
import { parse } from "url";
function setupWebSocketServer(server) {
  console.log("Setting up WebSocket server...");
  const wss2 = new WebSocketServer({ noServer: true });
  server.on("upgrade", (request, socket, head) => {
    console.log("Upgrade request received:");
    console.log("- URL:", request.url);
    console.log("- Headers:", JSON.stringify(request.headers, null, 2));
    console.log("- Session:", request.session);
    const { pathname } = parse(request.url || "");
    console.log("- Pathname:", pathname);
    if (pathname === "/api/notifications") {
      const cookies = request.headers.cookie?.split(";").map((cookie) => cookie.trim()).reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
      }, {});
      console.log("Parsed cookies:", cookies);
      const sessionId = cookies?.["connect.sid"];
      console.log("Session ID:", sessionId);
      if (!sessionId) {
        console.log("No session ID found, rejecting connection");
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }
      wss2.handleUpgrade(request, socket, head, (ws) => {
        console.log("Upgrade successful, establishing WebSocket connection");
        const authenticatedWs = ws;
        authenticatedWs.isAlive = true;
        if (request.session?.userId) {
          authenticatedWs.userId = request.session.userId;
          console.log("Associated WebSocket with user:", authenticatedWs.userId);
        }
        wss2.emit("connection", authenticatedWs, request);
      });
    } else {
      console.log("Invalid pathname, ignoring upgrade request");
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.destroy();
    }
  });
  wss2.on("connection", (ws) => {
    console.log("New client connected");
    console.log("Total connected clients:", wss2.clients.size);
    if (ws.userId) {
      console.log("Authenticated user connected:", ws.userId);
    }
    ws.on("pong", () => {
      console.log("Received pong from client");
      ws.isAlive = true;
    });
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Received message from client:", data);
      } catch (error) {
        console.error("Error processing message:", error);
        console.error("Raw message:", message.toString());
      }
    });
    ws.on("close", (code, reason) => {
      console.log("Client disconnected");
      console.log("Close code:", code);
      console.log("Close reason:", reason.toString());
      console.log("Remaining connected clients:", wss2.clients.size);
      if (ws.userId) {
        console.log("User disconnected:", ws.userId);
      }
    });
  });
  const interval = setInterval(() => {
    console.log("Running health check. Connected clients:", wss2.clients.size);
    wss2.clients.forEach((ws) => {
      const client = ws;
      if (client.isAlive === false) {
        console.log("Terminating inactive client");
        return client.terminate();
      }
      client.isAlive = false;
      client.ping();
      console.log("Sent ping to client");
    });
  }, 3e4);
  wss2.on("close", () => {
    console.log("WebSocket server closing");
    clearInterval(interval);
  });
  function broadcastNotification(notification) {
    console.log("Broadcasting notification:", notification);
    console.log("Number of connected clients:", wss2.clients.size);
    wss2.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log("Sending notification to client");
        client.send(JSON.stringify(notification));
      } else {
        console.log("Client not ready, state:", client.readyState);
      }
    });
  }
  return {
    wss: wss2,
    broadcastNotification
  };
}

// server/index.ts
var wss;
async function shutdown() {
  console.log("Shutting down server...");
  if (wss) {
    wss.close();
  }
  await closeMongoDB();
  process.exit(0);
}
async function bootstrap() {
  try {
    validateEnv();
    await connectToMongoDB();
    const app = createApp();
    const server = createServer(app);
    const wsServer = setupWebSocketServer(server);
    wss = wsServer.wss;
    app.locals.broadcastNotification = wsServer.broadcastNotification;
    await registerRoutes(app);
    if (!env.isProduction) {
      console.log("Setting up Vite middleware for development mode...");
      await setupVite(app, server);
    } else {
      console.log("Serving static files in production mode...");
      serveStatic(app);
    }
    const PORT = env.server.port;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Visit http://${env.server.host}:${PORT} in your browser`);
    });
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}
bootstrap().catch((err) => {
  console.error("Unhandled error during bootstrap:", err);
  process.exit(1);
});
