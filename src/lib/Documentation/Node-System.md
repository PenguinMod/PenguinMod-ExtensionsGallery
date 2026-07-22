# Node System

Hi! So... Just wanna let you know... this is actually the *second* version of the document. The first one got deleted because I'm pretty sure it was meant to be unused... This is OutsideFlight writing this, by the way. 

Now, you clicked on this markdown so you could learn about our extension about nodes and links, right? Well, without furthur ado, here's the facts!

## Blocks

These are the blocks that are used for the Node category.

### Nodes

* **Create node**: Here you can enter the coordinates for the node to go, and enter the ID that the code will be from!
* **Delete node**: Deletes the node with the ID specified. Will create gaps, so be careful!
* **Make a grid**: Here you can make a grid full of nodes that goes from the coordinates specified. If you don't change the default values it can create 9 nodes, but the links will not be added. I'll talk about this later.
* **Remove all nodes**: Take a wild guess.
* **Node with an ID of _ exists?**: This one is a boolean that checks if the node with an exists. Can be useful for filling in gaps between nodes!
* **Set Node Position**: Moves the node with the specified ID's position to a certain point.
* **X of Node**: Checks for the X of the node specified.
* **Y of Node**: Checks for the Y of the node specified.
* **Node closest to: ___**: This block checks for the closest node to a specific coordinate. This block is here instead of the "Node at 0, 0 block" because it just kind of works the same way.
* **Lowest node ID**: Checks for the lowest node ID. Not always equal to 1, so be careful!
* **Highest node ID**: Checks for the highest node ID. If there's gaps or if the ID goes into the negatives, the highest node ID will not be the same as the number of nodes there are.
* **Number of Nodes**: Checks for the number of nodes, not always the same as the highest node ID, like I said earlier.
* **All nodes**: It's just a JSON array of all the existing nodes. Not even readable, so maybe just ignore it...

### Links

* **Link node 1 to node 2**: Links nodes together, however they can only be exactly one space apart. Sorry!
* **Unlink node 1 from node 2** Unlinks nodes together, one node at a time.
* **Unlink all neighbors of node 1**:Unlinks all neighbors of the specified note. Deleting the node does the same thing as well, however.
* **Connect nodes within a range**: This one is actually quite interesting! Remember when I said links wouldn't be added to grids automatically? Well, this is your compromise! This block automatically creates pathways for a set range of ID's! Do this to a grid, and it will now have links!
* **Node linked to another?** Checks if a node is linked to another.
* **Go right of node 1**: It outputs the ID that is to the right of node 1. Keep in mind, this block will only work if there's a link between node 1 and the node next to it, but you can bypass the link check using something I'm gonna share later.
* **Neighbors of node**: Checks for the direct neighbors of the node specified that are connected via links.
* **Node neighbor amount**: Returns the amount of linked neighbors a node has.
* **Linked node index of node ID**: Returns the index of node ID, in the order of when the nodes were linked.
* **Number of links**: Returns the amount of links.
* **All Links**: Returns every link in the form of an array, slightly more readable.

## How to use

Like said in the description, you can use links to create roadmaps and mainly just a grid you can walk across.
Keep in mind you can only link nodes that are one grid space away from each other!
Here's an example project to get you started: 
<a>https://studio.penguinmod.com/editor.html?project_url=https://file.garden/Z6ed_EN2XgmRM_ni/Node%20Sample%20Project.pmp</a>
