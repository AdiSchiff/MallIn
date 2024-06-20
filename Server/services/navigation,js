const Node = require('../models/node');
const AztieliStoreService = require("../services/azrieli_store");

const createNode = async (id, x, y, edges) => {
    const node = new Node({
        "id": id,
        "x": x,
        "y": y,
        "edges": edges
    });
    return await node.save();
};

const getNodesFromStores = async (stores) => {
    const nodesId = []
    for (const storeObj of stores) {
      // Check if the store exists in the mall's collection
      const store = await AztieliStoreService.getStoresByName( storeObj.storename, storeObj.mallname );
      if (!store) {
        return null;
      }
      // Add the store id to the nodes id array
      nodesId.push(store.id);
    }
    return await getNodes(nodesId);
};

const getNodes = async (idList) => {
    const nodes = []
    for (const id of idList) {
      //Find the node of the current id
      const node = await Node.findOne({id: id});
      if (!node) {
        return null;
      }
      // Add the store id to the nodes array
      nodes.push(node);
    }
    return nodes;
};

const getNeighbors = async (nodeId) => {
    const node = await Node.findOne({id: nodeId});
    return await getNodes(node.edges);
};

function heuristic(node, goal) {
    // Implement your heuristic function (e.g., Manhattan distance)
    return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
    //לתקן הבדלים בין קומות?
};

const aStar = async (start, goal) => {
    // Initialize open and closed sets
    const openSet = new Set([start]);
    const closedSet = new Set();
      
    // Initialize g and f scores
    const gScore = new Map();
    const fScore = new Map();
    gScore.set(start, 0);
    fScore.set(start, heuristic(start, goal));
      
    // Initialize cameFrom map
    const cameFrom = new Map();
      
    while (openSet.size > 0) {
        // Get the node in openSet with the lowest fScore value
        let current;
        openSet.forEach(node => {
        if (!current || fScore.get(node) < fScore.get(current)) {
            current = node;
        }
        });
    
        // If the current node is the goal, reconstruct the path
        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }
    
        // Move current node from openSet to closedSet
        openSet.delete(current);
        closedSet.add(current);
    
        // Process each neighbor
        getNeighbors(current).forEach(neighbor => {
            if (closedSet.has(neighbor)) {
                return;
            }
        
            const tentativeGScore = gScore.get(current) + distBetween(current, neighbor);
        
            if (!openSet.has(neighbor)) {
                openSet.add(neighbor);
            } else if (tentativeGScore >= gScore.get(neighbor)) {
                return;
            }
        
            // Record the best path so far
            cameFrom.set(neighbor, current);
            gScore.set(neighbor, tentativeGScore);
            fScore.set(neighbor, gScore.get(neighbor) + heuristic(neighbor, goal));
        });
    }
      
    // If we reach here, it means there's no path
    return null;
};

function reconstructPath(cameFrom, current) {
    const totalPath = [current];
    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        totalPath.push(current);
    }
    return totalPath.reverse();
}
  
function distBetween(a, b) {
    return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
}
  
module.exports = { createNode, aStar, getNodesFromStores }
