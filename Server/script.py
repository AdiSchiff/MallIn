# import pymongo
# import xml.etree.ElementTree as ET
#
# # Establish connection to MongoDB
# client = pymongo.MongoClient("mongodb://localhost:27017/")
# db = client["mallin"]
# collection = db["nodes"]
#
# # Parse XML file
# tree = ET.parse('graph.xml')
# root = tree.getroot()
#
# # Function to extract attributes from a section element
# def extract_attributes(section):
#     attributes = {}
#     for attr in section.findall('attribute'):
#         key = attr.get('key')
#         value = attr.text.strip() if attr.text else None
#         attributes[key] = value
#     return attributes
#
# # Function to extract nodes and edges
# def extract_nodes_and_edges(root):
#     nodes = {}
#     for section in root.findall(".//section"):
#         if section.attrib.get("name") == "node":
#             node_attributes = extract_attributes(section)
#             graphics_section = section.find("./section[@name='graphics']")
#             if graphics_section is not None:
#                 graphics_attributes = extract_attributes(graphics_section)
#                 node_attributes.update(graphics_attributes)
#
#             node_id = node_attributes['id']
#             node_data = {
#                 'id': node_id,
#                 'x': node_attributes.get('x'),
#                 'y': node_attributes.get('y'),
#                 'edges': [],
#                 'floor': 0
#             }
#             nodes[node_id] = node_data
#         elif section.attrib.get("name") == "edge":
#             edge_attributes = extract_attributes(section)
#             source_id = edge_attributes.get('source')
#             target_id = edge_attributes.get('target')
#             if source_id in nodes:
#                 nodes[source_id]['edges'].append(target_id)
#             if target_id in nodes:
#                 nodes[target_id]['edges'].append(source_id)
#     return nodes
#
# # Insert nodes into MongoDB collection
# nodes_data = extract_nodes_and_edges(root)
# collection.insert_many(nodes_data.values())
import pymongo
import xml.etree.ElementTree as ET

# Establish connection to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["mallin"]
collection = db["nodes"]

# Parse XML file
tree = ET.parse('graph.xml')
root = tree.getroot()

# Function to extract attributes from a section element
def extract_attributes(section):
    attributes = {}
    for attr in section.findall('attribute'):
        key = attr.get('key')
        value = attr.text.strip() if attr.text else None
        attributes[key] = value
    return attributes

# Function to extract nodes and edges
def extract_nodes_and_edges(root):
    nodes = {}
    for section in root.findall(".//section"):
        if section.attrib.get("name") == "node":
            node_attributes = extract_attributes(section)
            graphics_section = section.find("./section[@name='graphics']")
            if graphics_section is not None:
                graphics_attributes = extract_attributes(graphics_section)
                node_attributes.update(graphics_attributes)

            node_id = node_attributes['id']
            node_data = {
                'id': node_id,
                'name': node_attributes.get('label'),  # Add label as name
                'x': node_attributes.get('x'),
                'y': node_attributes.get('y'),
                'edges': [],
                'floor': 3
            }
            nodes[node_id] = node_data
        elif section.attrib.get("name") == "edge":
            edge_attributes = extract_attributes(section)
            source_id = edge_attributes.get('source')
            target_id = edge_attributes.get('target')
            if source_id in nodes:
                nodes[source_id]['edges'].append(target_id)
            if target_id in nodes:
                nodes[target_id]['edges'].append(source_id)
    return nodes

# Insert nodes into MongoDB collection
nodes_data = extract_nodes_and_edges(root)
collection.insert_many(nodes_data.values())
