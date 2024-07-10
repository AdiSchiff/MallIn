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

const getRout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!(await loginController.isLoggedIn(token))) {
          return res.status(401).send();
        }
        //find the current location's store id
        const startNode = await navigationService.getNodesFromStores([req.params.store]);
        if (!startNode) {
            return res.status(404).send(null);
        }
        const stores = req.query.stores
        //find the stores ids
        const nodes = await navigationService.getNodesFromStores(stores);
        if (!nodes) {
            return res.status(404).send(null);
        }

        //לחשב את המסלול האופטימלי

        //find the path between every two nodes and add it to the full path
        let fullPath = [startNode];
        for (let i = 0; i < nodes.length - 1; i++) {
            if(i == 0){
                start = startNode;
                goal = nodes[i];
            } else {
                start = nodes[i];
                goal = nodes[i + 1];
            }
            const subPath = navigationService.aStar(start, goal);
            
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
        // Sort the stores according to the path
        // Create a map of node ids to their index positions
        const nodeIndexMap = nodeResult.reduce((map, node, index) => {
            map[node.id] = index;
            return map;
        }, {});

        // Filter stores that have corresponding nodes and sort them based on node index
        const sortedStores = stores
            .filter(store => nodeIndexMap.hasOwnProperty(store.id))
            .sort((storeA, storeB) => {
                const indexA = nodeIndexMap[storeA.id];
                const indexB = nodeIndexMap[storeB.id];
                return indexA - indexB;
            });

        //Create the return object that contains the path and the stores list sorted by the path
        const result = {
            "nodes": pathResult,
            "stores": sortedStores
        }
        return res.status(200).json(result);
    } catch (error) {
        alert(error);
    }
};

const createOrderedRout = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    if (loginController.isLoggedIn(token) !== -1) {

        if (!(await loginController.isLoggedIn(token))) {
        return res.status(401).send();
        }

        //find the current location's store id
        const startNode = await navigationService.getNodesFromStores([req.body.store], req.query.mallname);
        if (!startNode) {
            return res.status(404).send(null);
        }
        console.log("startNode" ,startNode)
        //find the stores ids
        const nodes = await navigationService.getNodesFromStores(req.body.stores);
        if (!nodes) {
            return res.status(404).send(null);
        }
        console.log("nodes" ,nodes)
        //find the path between every two nodes and add it to the full path
        let fullPath = [startNode];
        for (let i = 0; i < nodes.length - 1; i++) {
            if(i == 0){
                start = startNode;
                goal = nodes[i];
            } else {
                start = nodes[i];
                goal = nodes[i + 1];
            }
            const subPath = navigationService.aStar(start, goal);
            
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
  getRout,
  createOrderedRout,
};
