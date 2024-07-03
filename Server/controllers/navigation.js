const navigationService = require("../services/navigation");

const createNode = async (req, res) => {
  const newNode = await navigationService.createNode(
    req.body.id,
    req.body.x,
    req.body.y,
    req.body.edges
  );
  if (!newNode) {
    return res.status(500).json({});
  }
  return res.status(200).json({
    id: newNode.id,
    x: newNode.x,
    y: newNode.y,
    edges: newNode.edges
  });
};

const getRout = async (req, res) => {
    //לממש...
    try {
    const token = req.headers.authorization.split(" ")[1];
    if (!(await loginController.isLoggedIn(token))) {
        return res.status(401).send();
    }
    const user = await userService.getUser(req.params.username);
    if (!user) {
        return res.status(404).send(null);
    }
    return res.status(200).json({
        username: username,
        displayName: displayName,
    });
    } catch (error) {
    alert(error);
    }
};

const getOrderedRout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!(await loginController.isLoggedIn(token))) {
          return res.status(401).send();
        }
        //find the stores ids
        const startNode = await navigationService.getNodesFromStores([req.params.store]);
        const nodes = await navigationService.getNodesFromStores(req.params.stores);
        if (!nodes) {
            return res.status(404).send(null);
        }

        //find the path between every two nodes and add it to the full path
        let fullPath = [];
        for (let i = 0; i < nodes.length - 1; i++) {
            if(i == 0){
                const start = startNode;
                const goal = nodes[i];
            } else {
                const start = nodes[i];
                const goal = nodes[i + 1];
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
        return res.status(200).json(fullPath);
    } catch (error) {
    alert(error);
    }
};

module.exports = {
  createNode,
  getRout,
  getOrderedRout,
};
