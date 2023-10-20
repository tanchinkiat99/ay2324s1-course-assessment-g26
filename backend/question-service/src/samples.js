const seedQuestions = [
  {
    title: 'Reverse a String',
    description: `
    Write a function that reverses a string. The input string is given as an array of characters \`s\`.
    You must do this by modifying the input array in-place with \`O(1)\` extra memory.
    **Example 1**:
    > Input: s = ["h","e","l","l","o"] 
    > Output: ["o","l","l","e","h"] 
    **Example 2**:
    > Input: s = ["H","a","n","n","a","h"] 
    > Output: ["h","a","n","n","a","H"]
    **Constraints**:
    - \`1 <= s.length <= 10<sup>5</sup>\` 
    - \`s[i]\` is a printable ascii character
    `,
    categories: ['Strings', 'Algorithms'],
    complexity: 'Easy',
  },
  {
    title: 'Linked List Cycle Detection',
    description: `
    Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it.
    
    There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer. Internally, \`pos\` is used to denote the index of the node that tail's \`next\` pointer is connected to. **Note that \`pos\` is not passed as a parameter**.
    
    Return \`true\` if there is a cycle in the linked list. Otherwise, return \`false\`.
    
    ---
    
    **Example 1:**
    
    ![Example 1 Image](https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist.png)
    
    \`\`\`
    Input: head = [3,2,0,-4], pos = 1
    Output: true
    Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).
    \`\`\`
    
    **Example 2:**
    
    ![Example 2 Image](https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist_test2.png)
    
    \`\`\`
    Input: head = [1,2], pos = 0
    Output: true
    Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.
    \`\`\`
    
    **Example 3:**
    
    ![Example 3 Image](https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist_test3.png)
    
    \`\`\`
    Input: head = [1], pos = -1
    Output: false
    Explanation: There is no cycle in the linked list.
    \`\`\`
    
    ---
    
    **Constraints:**
    
    - The number of the nodes in the list is in the range \`[0, 10^4]\`.
    - \`-10^5 <= Node.val <= 10^5\`
    - \`pos\` is \`-1\` or a **valid index** in the linked-list.
    
    ---
    
    **Follow up:** Can you solve it using \`O(1)\` (i.e. constant) memory?
    `,
    categories: ['Data Structures', 'Algorithms'],
    complexity: 'Easy',
  },
  {
    title: 'Roman to Integer',
    description: `
    Roman numerals are represented by seven different symbols: \`I\`, \`V\`, \`X\`, \`L\`, \`C\`, \`D\` and \`M\`.
    
    | **Symbol** | **Value** |
    |------------|----------|
    | I          | 1        |
    | V          | 5        |
    | X          | 10       |
    | L          | 50       |
    | C          | 100      |
    | D          | 500      |
    | M          | 1000     |
    
    For example, \`2\` is written as \`II\` in Roman numeral, just two ones added together. \`12\` is written as \`XII\`, which is simply \`X + II\`. The number \`27\` is written as \`XXVII\`, which is \`XX + V + II\`.
    
    Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not \`IIII\`. Instead, the number four is written as \`IV\`. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as \`IX\`. There are six instances where subtraction is used:
    
    - \`I\` can be placed before \`V\` (5) and \`X\` (10) to make 4 and 9. 
    - \`X\` can be placed before \`L\` (50) and \`C\` (100) to make 40 and 90. 
    - \`C\` can be placed before \`D\` (500) and \`M\` (1000) to make 400 and 900.
    
    Given a roman numeral, convert it to an integer.
    
    ---
    
    **Example 1:**
    \`\`\`
    Input: s = "III"
    Output: 3
    Explanation: III = 3.
    \`\`\`
    
    **Example 2:**
    \`\`\`
    Input: s = "LVIII"
    Output: 58
    Explanation: L = 50, V= 5, III = 3.
    \`\`\`
    
    **Example 3:**
    \`\`\`
    Input: s = "MCMXCIV"
    Output: 1994
    Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.
    \`\`\`
    
    ---
    
    **Constraints:**
    - \`1 <= s.length <= 15\`
    - \`s\` contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').
    - It is **guaranteed** that \`s\` is a valid roman numeral in the range \`[1, 3999]\`.
    `,
    categories: ['Algorithms'],
    complexity: 'Easy',
  },
  {
    title: 'Add Binary',
    description: `
    Given two binary strings \`a\` and \`b\`, return *their sum as a binary string*.
    
    ---
    
    **Example 1:**
    \`\`\`
    Input: a = "11", b = "1"
    Output: "100"
    \`\`\`
    
    **Example 2:**
    \`\`\`
    Input: a = "1010", b = "1011"
    Output: "10101"
    \`\`\`
    
    ---
    
    **Constraints:**
    - \`1 <= a.length, b.length <= 10^4\`
    - \`a\` and \`b\` consist only of '0' or '1' characters.
    - Each string does not contain leading zeros except for the zero itself.
    `,
    categories: ['Bit Manipulation', 'Algorithms'],
    complexity: 'Easy',
  },
  {
    title: 'Fibonacci Number',
    description: `
    The **Fibonacci numbers**, commonly denoted \`F(n)\` form a sequence, called the **Fibonacci sequence**, such that each number is the sum of the two preceding ones, starting from \`0\` and \`1\`. That is,
    
    \`\`\`
    F(0) = 0, F(1) = 1
    F(n) = F(n - 1) + F(n - 2), for n > 1.
    \`\`\`
    
    Given \`n\`, calculate \`F(n)\`.
    
    ---
    
    **Example 1:**
    \`\`\`
    Input: n = 2
    Output: 1
    Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.
    \`\`\`
    
    **Example 2:**
    \`\`\`
    Input: n = 3
    Output: 2
    Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2.
    \`\`\`
    
    **Example 3:**
    \`\`\`
    Input: n = 4
    Output: 3
    Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.
    \`\`\`
    
    ---
    
    **Constraints:**
    - \`0 <= n <= 30\`
    `,
    categories: ['Recursion', 'Algorithms'],
    complexity: 'Easy',
  },
  {
    title: 'Implement Stack using Queues',
    description: `
    Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (\`push\`, \`top\`, \`pop\`, and \`empty\`).
    
    Implement the \`MyStack\` class:
    - \`void push(int x)\` Pushes element x to the top of the stack.
    - \`int pop()\` Removes the element on the top of the stack and returns it.
    - \`int top()\` Returns the element on the top of the stack.
    - \`boolean empty()\` Returns \`true\` if the stack is empty, \`false\` otherwise.
    
    **Notes:**
    - You must use **only** standard operations of a queue, which means that only \`push to back\`, \`peek/pop from front\`, \`size\` and \`is empty\` operations are valid.
    - Depending on your language, the queue may not be supported natively. You may simulate a queue using a list or deque (double-ended queue) as long as you use only a queue's standard operations.
    
    ---
    
    **Example 1:**
    \`\`\`
    Input
    ["MyStack", "push", "push", "top", "pop", "empty"]
    [[], [1], [2], [], [], []]
    Output
    [null, null, null, 2, 2, false]
    
    Explanation
    MyStack myStack = new MyStack();
    myStack.push(1);
    myStack.push(2);
    myStack.top(); // return 2
    myStack.pop(); // return 2
    myStack.empty(); // return False
    \`\`\`
    
    ---
    
    **Constraints:**
    - \`1 <= x <= 9\`
    - At most \`100\` calls will be made to \`push\`, \`pop\`, \`top\`, and \`empty\`.
    - All the calls to \`pop\` and \`top\` are valid.
    
    ---
    
    **Follow-up:** Can you implement the stack using only one queue?
    `,
    categories: ['Data Structures'],
    complexity: 'Easy',
  },
  {
    title: 'Combine Two Tables',
    description: `
    **Table: \`Person\`**
    
    | Column Name | Type    |
    |-------------|---------|
    | personId    | int     |
    | lastName    | varchar |
    | firstName   | varchar |
    
    - \`personId\` is the primary key (column with unique values) for this table.
    - This table contains information about the ID of some persons and their first and last names.
    
    ---
    
    **Table: \`Address\`**
    
    | Column Name | Type    |
    |-------------|---------|
    | addressId   | int     |
    | personId    | int     |
    | city        | varchar |
    | state       | varchar |
    
    - \`addressId\` is the primary key (column with unique values) for this table.
    - Each row of this table contains information about the city and state of one person with ID = PersonId.
    
    ---
    
    Write a solution to report the first name, last name, city, and state of each person in the \`Person\` table. If the address of a \`personId\` is not present in the \`Address\` table, report \`null\` instead.
    
    Return the result table in **any order**.
    
    The result format is in the following example.
    
    ---
    
    **Example 1:**
    
    **Input:** 
    \`\`\`
    Person table:
    | personId | lastName | firstName |
    |----------|----------|-----------|
    | 1        | Wang     | Allen     |
    | 2        | Alice    | Bob       |
    
    Address table:
    | addressId | personId | city          | state      |
    |-----------|----------|---------------|------------|
    | 1         | 2        | New York City | New York   |
    | 2         | 3        | Leetcode      | California |
    \`\`\`
    
    **Output:** 
    \`\`\`
    | firstName | lastName | city          | state    |
    |-----------|----------|---------------|----------|
    | Allen     | Wang     | Null          | Null     |
    | Bob       | Alice    | New York City | New York |
    \`\`\`
    
    **Explanation:** 
    There is no address in the address table for the personId = 1 so we return null in their city and state.
    addressId = 1 contains information about the address of personId = 2.
    `,
    categories: ['Databases'],
    complexity: 'Easy',
  },
  {
    title: 'Repeated DNA Sequences',
    description: '.',
    categories: ['Algorithms', 'Bit Manipulation'],
    complexity: 'Medium',
  },
  {
    title: 'Course Schedule',
    description: '.',
    categories: ['Data Structures', 'Algorithms'],
    complexity: 'Medium',
  },
  {
    title: 'LRU Cache Design',
    description: '.',
    categories: ['Data Structures'],
    complexity: 'Medium',
  },
  {
    title: 'Longest Common Subsequence',
    description: '.',
    categories: ['Strings', 'Algorithms'],
    complexity: 'Medium',
  },
  {
    title: 'Rotate Image',
    description: '.',
    categories: ['Arrays', 'Algorithms'],
    complexity: 'Medium',
  },
  {
    title: 'Airplane Seat Assignment Probability',
    description: '.',
    categories: ['Brainteaser'],
    complexity: 'Medium',
  },
  {
    title: 'Validate Binary Search Tree',
    description: '.',
    categories: ['Data Structures', 'Algorithms'],
    complexity: 'Medium',
  },
  {
    title: 'Sliding Window Maximum',
    description: '.',
    categories: ['Arrays', 'Algorithms'],
    complexity: 'Hard',
  },
  {
    title: 'N-Queen Problem',
    description: '.',
    categories: ['Algorithms'],
    complexity: 'Hard',
  },
  {
    title: 'Serialize and Deserialize a Binary Tree',
    description: '.',
    categories: ['Data Structures', 'Algorithms'],
    complexity: 'Hard',
  },
  {
    title: 'Wildcard Matching',
    description: '.',
    categories: ['Strings', 'Algorithms'],
    complexity: 'Hard',
  },
  {
    title: 'Chalkboard XOR Game',
    description: '.',
    categories: ['Brainteaser'],
    complexity: 'Hard',
  },
  {
    title: 'Trips and Users',
    description: '.',
    categories: ['Databases'],
    complexity: 'Hard',
  },
];

export default seedQuestions;
