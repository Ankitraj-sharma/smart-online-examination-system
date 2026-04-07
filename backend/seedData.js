// backend/seedData.js
// Run once to populate demo data:
//   node seedData.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");
const Question = require("./models/Question");
const Result = require("./models/Result");

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Data Science & AI"
];

const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const BATCHES = ["2024–2028", "2023–2027", "2022–2026", "2021–2025"];
const AVATARS = ["🧑‍🎓", "👩‍🎓", "🧑‍💻", "👩‍💻", "🦸", "🧠"];

const EXAM_TYPES = {
  dsa: {
    title: "Data Structures & Algorithms",
    subject: "Algorithms"
  },
  dbms: {
    title: "Database Management Systems",
    subject: "DBMS"
  },
  os: {
    title: "Operating Systems",
    subject: "OS"
  },
  networks: {
    title: "Computer Networks",
    subject: "Networks"
  },
  programming: {
    title: "Programming",
    subject: "Programming"
  },
  mixed: {
    title: "Mixed Concepts",
    subject: "Mixed"
  }
};

// DSA Questions
const DSA_QUESTIONS = [
  { q: "What is the time complexity of binary search?", opts: ["O(n)", "O(log n)", "O(n²)", "O(2^n)"], ans: 1 },
  { q: "Which data structure uses LIFO?", opts: ["Queue", "Stack", "Tree", "Graph"], ans: 1 },
  { q: "What is the time complexity of merge sort?", opts: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], ans: 1 },
  { q: "Which algorithm is used for shortest path in weighted graphs?", opts: ["DFS", "BFS", "Dijkstra", "Floyd-Warshall"], ans: 2 },
  { q: "What is the space complexity of quicksort?", opts: ["O(1)", "O(n)", "O(log n)", "O(n²)"], ans: 2 },
  { q: "Which of the following is a linear data structure?", opts: ["Tree", "Graph", "Array", "Heap"], ans: 2 },
  { q: "What is the time complexity of insertion in a hash table (average)?", opts: ["O(1)", "O(n)", "O(log n)", "O(n²)"], ans: 0 },
  { q: "Which sorting algorithm is stable?", opts: ["Quicksort", "Heapsort", "Mergesort", "None"], ans: 2 },
  { q: "What is the recurrence relation for binary search?", opts: ["T(n) = T(n-1) + 1", "T(n) = 2T(n/2) + n", "T(n) = T(n/2) + 1", "T(n) = T(n/2) + n"], ans: 2 },
  { q: "Which data structure is used for implementing priority queue?", opts: ["Array", "Heap", "Stack", "Queue"], ans: 1 },
  { q: "What is the worst-case time complexity of quicksort?", opts: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], ans: 2 },
  { q: "Which tree is balanced?", opts: ["Binary Search Tree", "AVL Tree", "Regular Tree", "None"], ans: 1 },
  { q: "What is dynamic programming?", opts: ["Sorting technique", "Memoization", "Optimization", "Searching"], ans: 1 },
  { q: "Time complexity of DFS:", opts: ["O(V + E)", "O(V²)", "O(E log V)", "O(V log E)"], ans: 0 },
  { q: "Which is NOT a linear data structure?", opts: ["Array", "Stack", "Queue", "Tree"], ans: 3 },
  { q: "What does NP-complete mean?", opts: ["Not Polynomial", "Non-deterministic Polynomial", "No Problem", "None"], ans: 1 },
  { q: "What is the time complexity of bubble sort (worst)?", opts: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], ans: 2 },
  { q: "Which is the most efficient sorting algorithm?", opts: ["Bubble Sort", "Merge Sort", "Insertion Sort", "Selection Sort"], ans: 1 },
  { q: "What is the degree of a node?", opts: ["Height", "Number of children", "Depth", "Level"], ans: 1 },
  { q: "Fibonacci sequence can be solved using which technique?", opts: ["Greedy", "Dynamic Programming", "Divide & Conquer", "Linear"], ans: 1 },
];

// DBMS Questions
const DBMS_QUESTIONS = [
  { q: "What is normalization?", opts: ["Data compression", "Reducing redundancy", "Encryption", "Indexing"], ans: 1 },
  { q: "Which normal form eliminates partial dependencies?", opts: ["1NF", "2NF", "3NF", "BCNF"], ans: 1 },
  { q: "What is ACID in databases?", opts: ["Acidity", "Properties of transactions", "Data types", "Query language"], ans: 1 },
  { q: "Which is NOT a type of join?", opts: ["Inner Join", "Left Join", "Top Join", "Full Join"], ans: 2 },
  { q: "What does SQL stand for?", opts: ["Structured Query Language", "Simple Query Language", "Schema Query Language", "Standard Query Logic"], ans: 0 },
  { q: "Primary key is:", opts: ["Optional", "Unique and mandatory", "Duplicates allowed", "Foreign key"], ans: 1 },
  { q: "What is indexing in databases?", opts: ["Organizing data", "Rapid data access", "Sorting", "Filtering"], ans: 1 },
  { q: "What is a foreign key?", opts: ["Primary key of another table", "Duplicate key", "Temporary key", "Composite key"], ans: 0 },
  { q: "Atomicity means:", opts: ["Breaking into atoms", "All or nothing", "Data splitting", "Table partitioning"], ans: 1 },
  { q: "What is a trigger?", opts: ["Error handler", "Automatic action", "Data type", "Query"], ans: 1 },
  { q: "Consistency in ACID means:", opts: ["Data organization", "Valid state transition", "Memory safety", "Processing"], ans: 1 },
  { q: "Which command deletes a table structure?", opts: ["DELETE", "DROP", "TRUNCATE", "REMOVE"], ans: 1 },
  { q: "What is a transaction?", opts: ["Money transfer", "Sequence of operations", "SQL query", "Data backup"], ans: 1 },
  { q: "Isolation in ACID means:", opts: ["Independent transactions", "Data hiding", "Table separation", "User restriction"], ans: 0 },
  { q: "What is a composite key?", opts: ["Single column key", "Multiple columns key", "Foreign key", "Primary key"], ans: 1 },
  { q: "BCNF is stricter than:", opts: ["1NF", "2NF", "3NF", "All above"], ans: 2 },
  { q: "What is denormalization?", opts: ["Combining tables for performance", "Data redundancy", "Query optimization", "All above"], ans: 0 },
  { q: "View is a:", opts: ["Physical table", "Virtual table", "Data backup", "Index"], ans: 1 },
  { q: "Which constraint ensures uniqueness?", opts: ["NOT NULL", "PRIMARY KEY", "UNIQUE", "FOREIGN KEY"], ans: 2 },
  { q: "Durability in ACID means:", opts: ["Data persistence", "No data loss", "Permanent storage", "All above"], ans: 0 },
];

// OS Questions
const OS_QUESTIONS = [
  { q: "What is a process?", opts: ["Program", "Running program instance", "File", "Memory"], ans: 1 },
  { q: "Which scheduling algorithm is preemptive?", opts: ["FCFS", "Round Robin", "Priority", "SJF"], ans: 1 },
  { q: "What is thrashing?", opts: ["Disk failure", "Excessive paging", "CPU usage", "Memory leak"], ans: 1 },
  { q: "Virtual memory allows:", opts: ["More RAM", "Running large programs", "Faster access", "Better security"], ans: 1 },
  { q: "What is a deadlock?", opts: ["Program crash", "Process waiting indefinitely", "Infinite loop", "Memory error"], ans: 1 },
  { q: "Which prevents deadlock - mutual exclusion, hold and wait, circular wait, no preemption?", opts: ["All needed", "Remove one", "Add one", "None"], ans: 1 },
  { q: "What is context switching?", opts: ["Changing context", "Switching processes", "Program execution", "Data transfer"], ans: 1 },
  { q: "IPC stands for:", opts: ["Internal Process Call", "Inter-Process Communication", "Input Processing Center", "None"], ans: 1 },
  { q: "What is a semaphore?", opts: ["Traffic signal", "Synchronization variable", "Process", "Memory block"], ans: 1 },
  { q: "Which page replacement is optimal?", opts: ["FIFO", "LRU", "Optimal", "Random"], ans: 2 },
  { q: "What is a zombie process?", opts: ["Dead process", "Terminated but parent not read", "Sleeping process", "Background process"], ans: 1 },
  { q: "What is a kernel?", opts: ["Seed part", "Core of OS", "Hardware part", "Software license"], ans: 1 },
  { q: "What is multiprogramming?", opts: ["Multiple programs", "Many CPUs", "Parallel execution", "Multiple tasks in memory"], ans: 3 },
  { q: "What is round robin scheduling time called?", opts: ["Time quantum", "Time slice", "Both", "Neither"], ans: 2 },
  { q: "What is CPU bound process?", opts: ["Uses more I/O", "Uses more CPU", "Uses more memory", "Uses network"], ans: 1 },
  { q: "What is I/O bound process?", opts: ["CPU intensive", "I/O intensive", "Memory intensive", "Network intensive"], ans: 1 },
  { q: "What is a shell?", opts: ["Hardware", "Command interpreter", "File", "Process"], ans: 1 },
  { q: "What is a buffer?", opts: ["Memory area", "Temporary storage", "Cache", "All above"], ans: 3 },
  { q: "What is RAID?", opts: ["Attack", "Disk array", "Memory type", "Storage"], ans: 1 },
  { q: "What is fragmentation?", opts: ["Memory waste", "Data loss", "Disk damage", "File corruption"], ans: 0 },
];

// Networks Questions
const NETWORKS_QUESTIONS = [
  { q: "What does TCP stand for?", opts: ["Transfer Control Protocol", "Transmission Control Protocol", "Data Protocol", "Network Protocol"], ans: 1 },
  { q: "Which layer does IP work?", opts: ["Data Link", "Transport", "Network", "Application"], ans: 2 },
  { q: "What is the range of well-known ports?", opts: ["0-255", "0-1023", "1024-65535", "100-1000"], ans: 1 },
  { q: "What is subnet mask?", opts: ["Network identification", "Host identification", "IP address", "Gateway"], ans: 0 },
  { q: "Which is a Layer 3 device?", opts: ["Switch", "Router", "Bridge", "Hub"], ans: 1 },
  { q: "What is UDP?", opts: ["Ordered delivery", "Connectionless, no guarantee", "Data protocol", "Secure protocol"], ans: 1 },
  { q: "What is MAC address used for?", opts: ["Internet addressing", "Physical addressing", "Port identification", "Security"], ans: 1 },
  { q: "What is DHCP?", opts: ["IP assignment", "Dynamic Host Config Protocol", "Network service", "All above"], ans: 2 },
  { q: "Which protocol is used for emails?", opts: ["HTTP", "SMTP", "FTP", "Telnet"], ans: 1 },
  { q: "What does DNS do?", opts: ["IP assignment", "Domain to IP resolution", "Email", "File transfer"], ans: 1 },
  { q: "Which protocol uses port 443?", opts: ["HTTP", "HTTPS", "FTP", "SMTP"], ans: 1 },
  { q: "What is a gateway?", opts: ["Connection point", "Network entrance", "Router", "All above"], ans: 2 },
  { q: "What is bandwidth?", opts: ["Signal strength", "Data transfer rate", "Connection type", "Speed"], ans: 1 },
  { q: "What is latency?", opts: ["Data rate", "Delay in transmission", "Connection speed", "Signal"], ans: 1 },
  { q: "Which is connectionless protocol?", opts: ["TCP", "UDP", "SMTP", "FTP"], ans: 1 },
  { q: "What is a firewall?", opts: ["Hardware", "Security system", "Network filter", "All above"], ans: 2 },
  { q: "What is IP spoofing?", opts: ["Data encryption", "Fake IP address", "Protocol", "Attack type"], ans: 1 },
  { q: "What is VPN?", opts: ["Public network", "Virtual Private Network", "Private network", "Secure connection"], ans: 1 },
  { q: "Which protocol is for web browsing?", opts: ["SMTP", "FTP", "HTTP", "Telnet"], ans: 2 },
  { q: "What is ARP used for?", opts: ["IP to MAC mapping", "Data transfer", "Routing", "Connection"], ans: 0 },
];

// Programming Questions
const PROGRAMMING_QUESTIONS = [
  { q: "What is OOP?", opts: ["Object-Oriented Programming", "Object Output Programming", "Optional Programming", "Online Programming"], ans: 0 },
  { q: "What is encapsulation?", opts: ["Data hiding", "Code hiding", "Variable hiding", "Method hiding"], ans: 0 },
  { q: "What is inheritance?", opts: ["Deriving properties", "Property transfer", "Data sharing", "Method copying"], ans: 0 },
  { q: "What is polymorphism?", opts: ["Many forms", "Many methods", "Many classes", "Many objects"], ans: 0 },
  { q: "What is the role of static keyword?", opts: ["Unchangeable", "Class level", "Local variable", "Global variable"], ans: 1 },
  { q: "What is a constructor?", opts: ["Object creator", "Initializer", "Object setup method", "All above"], ans: 2 },
  { q: "What is method overloading?", opts: ["Same name, different parameters", "Same name, same parameters", "Different name, same parameters", "None"], ans: 0 },
  { q: "What is method overriding?", opts: ["Same signature in subclass", "Different signature", "Parent class method", "None"], ans: 0 },
  { q: "What is the difference between == and equals()?", opts: ["No difference", "Reference vs value", "Same thing", "Language dependent"], ans: 1 },
  { q: "What is an abstract class?", opts: ["Cannot be instantiated", "Empty class", "Base class", "Interface"], ans: 0 },
  { q: "What is an interface?", opts: ["User interaction", "Contract for classes", "Abstract type", "Implementation"], ans: 1 },
  { q: "What is exception handling?", opts: ["Error prevention", "Error management", "Try-catch", "All above"], ans: 2 },
  { q: "What is garbage collection?", opts: ["Waste removal", "Memory cleanup", "Object deletion", "All above"], ans: 2 },
  { q: "What is a package?", opts: ["Archive", "Code organization", "Module", "Library"], ans: 1 },
  { q: "What is recursion?", opts: ["Function calling itself", "Loop repetition", "Method reuse", "Code reusability"], ans: 0 },
  { q: "What is iteration?", opts: ["Looping", "Repetition", "Cycle", "All above"], ans: 2 },
  { q: "What is the purpose of 'this'?", opts: ["Reference to object", "Reference to class", "Reference to method", "Reference to variable"], ans: 0 },
  { q: "What is the purpose of 'super'?", opts: ["Parent class reference", "Super method", "Override reference", "Class reference"], ans: 0 },
  { q: "What is a callback?", opts: ["Function reference", "Function parameter", "Function execution", "Function return"], ans: 0 },
  { q: "What is asynchronous programming?", opts: ["Concurrent execution", "Non-blocking", "Multiple threads", "All above"], ans: 2 },
];

// Random question picker
const ALL_QUESTIONS = [
  { pool: DSA_QUESTIONS, examId: "dsa", subject: "Algorithms", title: "Data Structures & Algorithms" },
  { pool: DBMS_QUESTIONS, examId: "dbms", subject: "DBMS", title: "Database Management Systems" },
  { pool: OS_QUESTIONS, examId: "os", subject: "OS", title: "Operating Systems" },
  { pool: NETWORKS_QUESTIONS, examId: "networks", subject: "Networks", title: "Computer Networks" },
  { pool: PROGRAMMING_QUESTIONS, examId: "programming", subject: "Programming", title: "Programming" },
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear existing data
    console.log("🧹 Clearing existing demo data...");
    await User.deleteMany({ role: "student" });
    await Question.deleteMany({});
    await Result.deleteMany({});

    // Create 20 Students
    console.log("👥 Creating 20 students...");
    const students = [];
    for (let i = 1; i <= 20; i++) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash("student123", salt);
      
      const student = await User.create({
        name: `Student ${i}`,
        email: `student${i}@exam.com`,
        password,
        role: "student",
        studentId: `STU00${String(i).padStart(3, '0')}`,
        rollNumber: `ROLL${String(i).padStart(3, '0')}`,
        department: DEPARTMENTS[i % DEPARTMENTS.length],
        semester: SEMESTERS[(i % SEMESTERS.length)],
        batch: BATCHES[i % BATCHES.length],
        phone: `9${String(Math.random()).slice(2, 11)}`,
        avatar: AVATARS[i % AVATARS.length],
      });
      students.push(student);
    }
    console.log(`✅ Created ${students.length} students`);

    // Create 20 Questions per exam type
    console.log("📚 Creating questions...");
    let totalQuestions = 0;
    const admin = students[0]; // Use first student as creator
    
    for (const examData of ALL_QUESTIONS) {
      const questions = [];
      const poolSize = examData.pool.length;
      
      for (let i = 0; i < 20; i++) {
        const qData = examData.pool[i % poolSize];
        const question = await Question.create({
          questionText: qData.q,
          options: qData.opts,
          correctAnswer: qData.ans,
          subject: examData.subject,
          examId: examData.examId,
          examTitle: examData.title,
          tags: [examData.subject, `question-${i + 1}`],
          marks: 1,
          createdBy: admin._id,
        });
        questions.push(question);
      }
      
      totalQuestions += questions.length;
      console.log(`  ✅ Created 20 ${examData.subject} questions`);
    }
    console.log(`✅ Created total ${totalQuestions} questions`);

    // Create 20 Results
    console.log("📊 Creating exam results...");
    const results = [];
    const examNames = Object.values(EXAM_TYPES);
    
    for (let i = 0; i < 20; i++) {
      const student = students[i];
      const exam = examNames[i % examNames.length];
      const totalMarks = 20;
      const score = Math.floor(Math.random() * totalMarks) + 1;
      const correctCount = score;
      const wrongCount = totalMarks - score - Math.floor(Math.random() * 3);
      const skippedCount = Math.floor(Math.random() * 3);
      const unattemptedCount = totalMarks - correctCount - wrongCount - skippedCount;
      
      const result = await Result.create({
        student: student._id,
        examName: exam.title,
        subject: exam.subject,
        answers: new Map([[String(Math.floor(Math.random() * 10)), Math.floor(Math.random() * 4)]]),
        score,
        totalMarks,
        percentage: (score / totalMarks * 100).toFixed(2),
        timeTaken: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
        correctCount,
        wrongCount,
        skippedCount,
        unattemptedCount,
      });
      results.push(result);
    }
    console.log(`✅ Created ${results.length} exam results`);

    console.log("\n✅ Seed data created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 Summary:");
    console.log(`   • Students: 20`);
    console.log(`   • Questions: ${totalQuestions}`);
    console.log(`   • Results: 20`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👉 Student credentials: student1@exam.com to student20@exam.com");
    console.log("👉 Password for all: student123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err.message);
    process.exit(1);
  }
}

seedData();
