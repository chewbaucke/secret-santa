# Secret Santa Algorithm Analysis

## Overview

This document compares different algorithms for solving the Secret Santa assignment problem with constraints.

## Problem Definition

Given `n` participants, each with a list of `notAllowedNames`, assign each participant a unique receiver such that:
1. No one is assigned to themselves
2. No one is assigned to someone in their `notAllowedNames` list
3. Each participant receives exactly one assignment

## Algorithms Compared

### 1. Greedy Random (Current Implementation)
**Approach**: Iterate through participants in order, randomly assign each to a valid receiver.

**Time Complexity**: 
- Best case: O(n²) - one attempt succeeds
- Worst case: O(n² × k) where k is number of retries needed

**Space Complexity**: O(n)

**Pros**:
- Simple to understand and implement
- Fast when constraints are loose
- Good randomization

**Cons**:
- May need many retries (especially with tight constraints)
- No guarantee of finding solution even if one exists
- Can get stuck in "dead ends" early

**Best For**: Small groups with loose constraints

---

### 2. Backtracking
**Approach**: Systematic depth-first search that tries all valid assignments and backtracks when stuck.

**Time Complexity**: 
- Best case: O(n²) - finds solution immediately
- Worst case: O(n!) - explores all permutations (rarely happens due to pruning)

**Space Complexity**: O(n) for recursion stack

**Pros**:
- **Guaranteed to find a solution if one exists**
- Systematic exploration prevents getting stuck
- Good pruning reduces search space

**Cons**:
- Slightly more complex implementation
- Can be slower than greedy for very loose constraints
- Recursive (though stack depth is only n)

**Best For**: When you need guaranteed success, or tight constraints

---

### 3. Shuffle & Verify
**Approach**: Generate a random permutation, check if it's valid, retry if not.

**Time Complexity**: 
- Best case: O(n²) - first shuffle is valid
- Worst case: O(n² × k) where k can be very large

**Space Complexity**: O(n)

**Pros**:
- Extremely simple implementation
- Perfect randomization (all valid solutions equally likely)

**Cons**:
- **Very inefficient for tight constraints** - may need thousands of attempts
- No guarantee of success
- Wastes time on invalid permutations

**Best For**: Very loose constraints only (not recommended for production)

---

### 4. MRV Heuristic (Minimum Remaining Values)
**Approach**: Always assign the person with the fewest valid options first.

**Time Complexity**: O(n²) typically

**Space Complexity**: O(n)

**Pros**:
- **Handles tight constraints much better than greedy**
- Reduces probability of getting stuck
- Still maintains randomness within valid options

**Cons**:
- Slightly more complex than greedy
- Still not guaranteed (though much better than greedy)

**Best For**: Tight constraints where backtracking might be overkill

---

### 5. Graph-based Matching
**Approach**: Model as bipartite graph matching problem, use DFS to find perfect matching.

**Time Complexity**: O(n²) in practice

**Space Complexity**: O(n²) for adjacency list

**Pros**:
- Clean mathematical model
- Guaranteed to find solution if one exists
- Efficient implementation

**Cons**:
- More complex conceptually
- Uses more memory for graph representation

**Best For**: When you want guaranteed success with good performance

---

## Performance Results (10 participants)

Based on benchmarking with your current `participants.json`:

| Algorithm | Attempts | Time | Success Rate |
|-----------|----------|------|--------------|
| Greedy Random | 2 | 0.40ms | ✅ |
| Backtracking | 1 | 0.12ms | ✅ |
| Shuffle & Verify | 22 | 0.11ms | ✅ |
| MRV Heuristic | 1 | 0.17ms | ✅ |
| Graph-based | 1 | 0.11ms | ✅ |

**Note**: Times are very fast for 10 participants. Differences become more significant with larger groups or tighter constraints.

---

## Recommendations

### For Your Current Use Case (10 participants, moderate constraints):
**Keep the current greedy approach** - it's simple, fast enough, and works well.

### If You Need Guaranteed Success:
Use **Backtracking** or **Graph-based Matching**. Both guarantee finding a solution if one exists.

### If Constraints Get Tighter:
Switch to **MRV Heuristic** - it's a drop-in replacement that handles tight constraints much better than greedy.

### If You Need Perfect Randomization:
Use **Shuffle & Verify** only if constraints are very loose, otherwise use **Backtracking** with randomization.

---

## Scalability Considerations

For larger groups (50+ participants):

1. **Greedy Random**: May need many retries, but still acceptable
2. **Backtracking**: Remains efficient due to pruning
3. **Shuffle & Verify**: Becomes impractical with tight constraints
4. **MRV Heuristic**: Scales well, good middle ground
5. **Graph-based**: Scales well, guaranteed success

---

## Implementation Notes

All algorithms maintain the same interface:
```javascript
function algorithm(participants, constraints) {
  // Returns Map<giver, receiver> or null if no solution found
}
```

This makes it easy to swap algorithms in your main script.

