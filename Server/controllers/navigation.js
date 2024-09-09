const navigationService = require("../services/navigation");
const loginController = require("./login");

const createNode = async (req, res) => {
  const newNode = await navigationService.createNode(
    req.body.id,
    req.body.x,
    req.body.y,
    req.body.edges, 
    req.body.floor,
    req.body.name
  );
  if (!newNode) {
    return res.status(500).json({});
  }
  return res.status(200).json({
    id: newNode.id,
    x: newNode.x,
    y: newNode.y,
    edges: newNode.edges,
    floor: newNode.floor,
    mane: newNode.name
  });
};

async function getGraphInstance() {
    return await navigationService.getGraphInstance()
}

const createRout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!(await loginController.isLoggedIn(token))) {
          return res.status(401).send();
        }
        //find the current location's node
        const startNode = await navigationService.getNodesFromStores([req.body.store], req.query.mallname);
        if (!startNode) {
            return res.status(404).send(null);
        }
        const stores = req.body.stores
        //find the stores nodes
        const nodes = await navigationService.getNodesFromStores(req.body.stores, req.query.mallname);
        if (!nodes) {
            return res.status(404).send(null);
        }

        // Initialize full path with the start node
        let fullPath = [startNode[0]];
        let unvisitedNodes = nodes.slice();
        let currentNode = startNode[0];

        while (unvisitedNodes.length > 0) {
            let closestNode = null;
            let shortestPath = null;
            let shortestDistance = Infinity;

            // Find the closest unvisited node
            for (let i = 0; i < unvisitedNodes.length; i++) {
                const subPath = await navigationService.aStar(currentNode, unvisitedNodes[i]);
                if (subPath !== null) {
                    const distance = navigationService.calcPathDistance(subPath)
                    if (distance < shortestDistance) {
                        closestNode = unvisitedNodes[i];
                        shortestPath = subPath;
                        shortestDistance = distance;
                    }
                }
            }

            if (closestNode === null || shortestPath === null) {
                return res.status(404).send(null); // No valid path found
            }

            // Remove the first node of each segment to avoid duplication
            fullPath = fullPath.concat(shortestPath.slice(1));
            unvisitedNodes = unvisitedNodes.filter(node => node !== closestNode);
            currentNode = closestNode;
        }

        // Create the path result containing the node result object
        let pathResult = fullPath.map(n => ({
            id: n.id,
            x: n.x,
            y: n.y,
            floor: n.floor,
            name: n.name
        }));

        // Create a map of the nodes in the path to their indexes
        let nodeIndexMap = pathResult.reduce((map, node, index) => {
            if (!(node.name in map)) {  // Check if the id is not already in the map
                map[node.name] = index;
            }
            return map;
        }, {});
        // Sort the stores according to the path
        let sortedStores = stores
            .filter(store => nodeIndexMap.hasOwnProperty(store.storename))
            .sort((storeA, storeB) => {
                const indexA = nodeIndexMap[storeA.storename];
                const indexB = nodeIndexMap[storeB.storename];
                return indexA - indexB;
            });
        const result = {
            nodes: pathResult,
            stores: sortedStores
        };

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

const createOrderedRout = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    if (loginController.isLoggedIn(token) !== -1) {

        if (!(await loginController.isLoggedIn(token))) {
        return res.status(401).send();
        }

        //find the current location's node
        const startNode = await navigationService.getNodesFromStores([req.body.store], req.query.mallname);
        if (!startNode) {
            return res.status(404).send(null);
        }
        //find the stores nodes
        const nodes = await navigationService.getNodesFromStores(req.body.stores, req.query.mallname);
        if (!nodes) {
            return res.status(404).send(null);
        }
        //find the path between every two nodes and add it to the full path
        let fullPath = [];
        for (let i = 0; i < nodes.length; i++) {
            if(i == 0){
                start = startNode[0];
                goal = nodes[i];
            } else {
                if(i == nodes.length-1) {
                    break
                }
                start = nodes[i];
                goal = nodes[i + 1];
            }
            const subPath = await navigationService.aStar(start, goal);
            if (!subPath) {
                return res.status(404).send(null);
            }
            if (subPath === null) {
                return res.status(404).send(null);
            }
        
            // If it's the first segment, include all nodes
            // Otherwise, exclude the first node of each segment to avoid duplication
            if (i === 0) {
                fullPath = fullPath.concat(subPath);
            } else {
                fullPath = fullPath.concat(subPath.slice(1));
            }
        }
        let pathResult = []
        for (let n of fullPath) {
            // Create a node result object
            const nodeResult = {
                id: n.id,
                x: n.x,
                y: n.y,
                floor: n.floor,
                name: n.name,
            };
            // Add the store object to the mall's stores array
            pathResult.push(nodeResult);
        }
        return res.status(200).json(pathResult);
    }
    return res.status(401).send();
};

const createRedirection = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    if (loginController.isLoggedIn(token) !== -1) {

        if (!(await loginController.isLoggedIn(token))) {
        return res.status(401).send();
        }

        //find the current location's node
        const startNode = req.body.node;
        if (!startNode) {
            return res.status(404).send(null);
        }
        //find the stores nodes
        const nodes = await navigationService.getNodesFromStores(req.body.stores, req.query.mallname);
        if (!nodes) {
            return res.status(404).send(null);
        }
        //find the path between every two nodes and add it to the full path
        let fullPath = [];
        for (let i = 0; i < nodes.length; i++) {
            if(i == 0){
                start = startNode;
                goal = nodes[i];
            } else {
                if(i == nodes.length-1) {
                    break
                }
                start = nodes[i];
                goal = nodes[i + 1];
            }
            const subPath = await navigationService.aStar(start, goal);
            if (!subPath) {
                return res.status(404).send(null);
            }
            if (subPath === null) {
                return res.status(404).send(null);
            }
        
            // If it's the first segment, include all nodes
            // Otherwise, exclude the first node of each segment to avoid duplication
            if (i === 0) {
                fullPath = fullPath.concat(subPath);
            } else {
                fullPath = fullPath.concat(subPath.slice(1));
            }
        }
        let pathResult = []
        for (let n of fullPath) {
            // Create a node result object
            const nodeResult = {
                id: n.id,
                x: n.x,
                y: n.y,
                floor: n.floor,
                name: n.name,
            };
            // Add the store object to the mall's stores array
            pathResult.push(nodeResult);
        }
        return res.status(200).json(pathResult);
    }
    return res.status(401).send();
};

module.exports = {
  createNode,
  getGraphInstance,
  createRout,
  createOrderedRout,
  createRedirection
};
