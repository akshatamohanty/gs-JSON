// ========================= ENUMS =========================
// EGeomType, EDataType, EObjType

/**
* Enum, the different types of geometric elements.
* Objects and Points are entities (see subclasses of the Ent class).
* Faces, Wires, Edges, and Vertices are topological components (see subclasses of the Topo class).
* Attributes can be attached to all these elements.
*/
export enum EGeomType {
    objs="objs",
    faces="faces",
    wires="wires", 
    edges="edges",
    vertices="vertices",
    points="points"
}
/**
* Enum, the different data types for attributes.
*/
export enum EDataType {
    type_str="string",
    type_num="number",
    type_bool="boolean",
    type_str_arr="string[]",
    type_num_arr="number[]",
    type_bool_arr="boolean[]",
}
/**
* Enum, the different types of geometric objects (see the subclasses of the Obj class.)
*/
export const enum EObjType {
    polyline = 100,
    nurbs_curve = 120,
    bezier_curve = 121,
    polymesh = 200,
    nurbs_surface = 220,
    bezier_surface = 221,
}
// ========================= MAPS =========================
// mapStringToAttribType, mapStringToDataType

/**
* Map, from string to EGeomType.
* This is used when parsing JSON.
*/
export let mapStringToGeomType = new Map<string,EGeomType> ([
    ["objs",EGeomType.objs],
    ["faces",EGeomType.faces],
    ["wires",EGeomType.wires],
    ["edges",EGeomType.edges],
    ["vertices",EGeomType.vertices],
    ["points",EGeomType.points]
])
/**
* Map, EGeomType to String.
* This is used for printing.
*/
export let attribTypeStrings = [
    "objs",
    "faces",
    "wires",
    "edges",
    "vertices",
    "points"
]
/**
* Map, from strings to DataType.
* This is used when parsing JSON.
*/
export let mapStringToDataType = new Map<string,EDataType> ([
    ["string",EDataType.type_str],
    ["number",EDataType.type_num],
    ["boolean",EDataType.type_bool],
    ["string[]",EDataType.type_str_arr],
    ["number[]",EDataType.type_num_arr],
    ["boolean[]",EDataType.type_bool_arr]
])
// ========================= INTERFACES for reading gsJSON data =========================
// IMetadata, IAttribData, IGroupData, ISkinData, IModelData

/**
* Interface, for parsing JSON Metadata.
*/
export interface IMetadata {
    filetype: "gs-json";
    version: string;
    crs: any;
    location: string;
}
/**
* Interface, for parsing JSON AttribData.
*/
export interface IAttribData {
    name: string;
    geom_type: "points" | "vertices" | "edges" | "wires" | "faces" | "objs"; //enum not working
    data_type: "string"|"number"|"boolean"|"string[]"|"number[]"|"boolean[]"; //enum not working
    values: any[];
}
/**
* Interface, for parsing JSON GroupData.
*/
export interface IGroupData {
    name: string;
    parent?:string;
    objs?: any[];//TODO
    props?: { key: string, value: any }
}
/**
* Interface, for parsing JSON SkinData.
*/
export interface ISkinData {
    images: string[];
    textures: string[];
    materials: any[];
}
/**
* Interface, for parsing JSON ModelData.
*/
export interface IModelData {
    metadata: IMetadata;
    points?: [number[],number[][]];
    objs?: any[];
    attribs?: IAttribData[];
    groups?: IGroupData[];
    skins?: ISkinData[];
}
// ========================= DATA STRUCTURES =========================
// IDict, IAttribDict, IAttribTypesDict, IGroupsDict

/**
* Interface, a general purpose dictionary.
*/
export interface IDict {
    [key: string] : any;
}
/**
* Interface, a dictionary for storing Attrib instances.
* The key is the name of the Attrib, and the value is an instance of class Attrib.
* This is used in the main Model class to store all the attributes in the model.
*/
export interface IAttribDict {
    [key: string] : IAttrib;
}
/**
* Interface, a dictionary for storing Attrib dictionaries.
* This is used in the main Model class to store attributes.
* For each Attrib type, there is a dictionary of attributes.
* This makes finding attributes faster. For example, to find
* a particular point attribute called "xxx", the format is:
* "attrib_types_dict.points.xxx"
*/
export interface IAttribTypesDict {
    objs: IAttribDict;
    points: IAttribDict;
    faces: IAttribDict;
    wires: IAttribDict;
    edges: IAttribDict;
    vertices: IAttribDict;
}
/**
* Interface, a dictionary for storing Group instances.
* The key is the name of the Group, and the value is an instance of class Group.
* This is used in the main Model class to store all teh groups in teh model.
*/
export interface IGroupsDict {
    [key: string] : IGroup;
}
// ========================= INTERFACES for Model and Geom classes =========================
// IModel, IGeom, IGeomPath

/**
* Interface, the main model class.
*/
export interface IModel {
    //constructor()
    //Geometry
    getGeom():IGeom;
    setData(data:IModelData):void;
    //Attribs
    getAttribs(attrib_type:EGeomType):IAttrib[];
    getAttrib(name:string, attrib_type:EGeomType):IAttrib;
    addAttrib(name:string, attrib_type:EGeomType, data_type:EDataType):IAttrib;
    delAttrib(name:string, attrib_type:EGeomType):boolean;
    //Groups
    getGroups():IGroup[];
    getGroup(name:string):IGroup;
    addGroup(name:string):IGroup;
    delGroup(name:string):boolean;
    //Clean up nulls and unused points
    purgePoints():number;
    purgeNulls():number;
    //Runs some check
    validateModel():boolean;
}
//Class to hold manipulate geometry arrays
/**
* Interface, for the Geom class, that stores all the geometry in the model.
* This has arrays for both point data and object data.
*/
export interface IGeom  {
    //constructor(model:ifs.IModel, point_data?:any[], obj_data?:any[]) 
    getModel():IModel;
    //Creation
//    addPoint(xyz:number[]):IPoint;
    addPoint(xyz:number[]):void;
//    addPolyline(wire_points:IPoint[]):IObj;
    addPolyline(wire_points:IPoint[]):void;
    addPolymesh(wire_points:IPoint[], face_points:IFace[]):IObj;
    //Generic method for getting data
    getPointData(id:number):any[];
    getObjData(path?:IGeomPath):any;
    //Points
    getPointIDs(obj_type?:EObjType):number[];
    getPoints(obj_type?:EObjType):IPoint[];
    getPoint(point_id:number):IPoint;
    delPoint(point_id:number):boolean;
    numPoints(obj_type?:EObjType):number;
    setPointPosition(point_id:number, xyz:number[]):number[];
    getPointPosition(point_id:number,):number[];
    //Objs
    getObjIDs(obj_type?:EObjType):number[];
    getObjs(obj_type?:EObjType):IObj[];
    getObj(obj_id:number):IObj;
    delObj(obj_id:number):boolean;
    numObjs(obj_type?:EObjType):number;
    //Topos
    getTopos(topo_type:EGeomType):ITopo[];
    numTopos(topo_type:EGeomType):number;
    //Attribs
    getAttribTemplate(attrib_type:EGeomType):any[];
}
// interface for path to a single topo component
// This is used by:
//     attrib.getValue(path) and attrib.setValue(path, value)
//     ent.getGeomPath()
/**
* Interface, for the GeomPath class. 
* This is used to define a path to a particular geometric element.
* The geometric element could be either an Ent entity (Point or Obj),
* or it could be a Topo component (Vertex, Edge, Wire, or Face).
*/
export interface IGeomPath {
    id:number;             //id, point_id or an obj_id
    tt:EGeomType.wires|EGeomType.faces;          //topo type, wires or faces
    ti:number;             //topo index
    st:EGeomType.vertices|EGeomType.edges        //sub topo-type, vertices or edges
    si:number;             //sub topo-index
    equals(path:IGeomPath):boolean;
    toString():string;
}
// ========================= INTERFACES for Ent classes and Subclasses =========================
// IEnt, IPoint, IObj, IPolyline, IPolymesh, 

/**
* Interface, for the abstract Ent class, that represents any geometric entity.
* The Ent class cannot be instantiated. 
*/
export interface IEnt  {
    //constructor(geom:ifs.IGeom, id:number) 
    getID():number;
    getGeom():IGeom;
    getModel():IModel;
    getGeomType():EGeomType;
    //attribs
    getAttribNames():string[];
    getAttribValue(name:string):any;
    setAttribValue(name:string, value:any):any;
    //groups
    getGroupNames():string[];
    addToGroup(name:string):boolean;
}
/**
* Interface, for the Point class, that represents a 3D point with xyz coords.
*/
export interface IPoint extends IEnt {
    //constructor cannot be used to create a new point
    //use the "add" method in Geom class
    getPosition():number[];
    setPosition(xyz:number[]):number[];
    getVertices():IVertex[];
}
/**
* Interface, for the abstract Obj class, that represents a geometric object.
* Subclasses such as Polyline and polymesh can be instantiated.
*/
export interface IObj extends IEnt {
    //constructor cannot be used to create a new point
    //use the "add" method in Geom class
    getObjType():EObjType;
    //
    getWires():IWire[];
    getFaces():IFace[];
    //
    numWires():number;
    numFaces():number;
}
/**
* Interface, for a Polyline class.
*/
export interface IPolyline  extends IObj {
}
/**
* Interface, for a Polymesh class.
*/
export interface IPolymesh extends IObj {
}
// ========================= INTERFACES for Topo classes and Subclasses =========================
// ITopo, IVertex, IEdge, IWire, IFace


/**
* Interface, for Topo abstract class, that represents any topological component.
*/
export interface ITopo {
    //constructor(geom:ifs.IGeom, geom_path:ifs.IGeomPath)
    getGeom():IGeom;
    getModel():IModel;
    getObjID():number;
    getGeomType():EGeomType;
    //attribs
    getAttribNames():string[];
    setAttribValue(name:string, value:any):any;
    getAttribValue(name:string):any;
    //groups
    getGroupNames():string[];
}
/**
* Interface, for Vertex class.
*/
export interface IVertex extends ITopo {
    getPoint(): IPoint;
    getEdge():IEdge;
    getWireOrFace():IWire|IFace; 
    next():IVertex;
    previous():IVertex;    
    verticesSharedPoint():IVertex[][];
    verticesSamePosition():IVertex[][];
}
/**
* Interface, for Edge class.
*/
export interface IEdge extends ITopo {
    getVertices(): IVertex[];
    getWireOrFace():IWire|IFace;
    next():IEdge;
    previous():IEdge;
    edgesSharedPoints():IEdge[][];
}
/**
* Interface, for Wire class.
*/
export interface IWire extends ITopo {
    getVertices():IVertex[];
    getEdges(): IEdge[];
    numVertices():number;
    numEdges():number;
    isClosed():boolean;
}
/**
* Interface, for Face class.
*/
export interface IFace extends ITopo {
    getVertices():IVertex[];
    getEdges(): IEdge[];
    numVertices():number;
    numEdges():number;
    facesSharedPoints(num_shared_points?:number):IFace[];
    isClosed():boolean;
}
// ========================= INTERFACES for Attrib and Group classes =========================
// IAttrib, IGroup

/**
* Interface, for Attrib class.
*/
export interface IAttrib {
    //constructor(model:ifs.IModel, 
    //    name:string, attrib_type:ifs.EGeomType, data_type:ifs.EDataType, 
    //    values_map?:any[], values?:any[])
    getName():string;
    setName(name:string):string;
    getGeomType():EGeomType;
    getObjDataType():EDataType;
    //Attrib Values
    getValue(path:IGeomPath):any;
    setValue(path:IGeomPath, value:any):any;
    count():number;
}
/**
* Interface, for Group class.
*/
export interface IGroup {
    //constructor(model:ifs.IModel, name:string)
    getName():string;
    setName(name:string):string;
    //Parent/child groups
    getParentGroup():IGroup;
    getChildGroups():IGroup[];
    setParentGroup(group:IGroup):boolean;
    removeParentGroup(group:IGroup):boolean;
    //Points in this group
    getPointIDs():number[];
    addPoint(point_id:number):boolean;
    addPoints(point_ids:number[]):boolean;
    removePoint(point_id:number):boolean;
    removePoints(point_ids:number[]):boolean;
    //Objs in this group
    getObjIDs(obj_type?:EObjType):number[];
    addObj(obj_id:number):boolean;
    addObjs(obj_ids:number[]):boolean;
    removeObj(obj_id:number):boolean;
    removeObjs(obj_ids:number[]):boolean;
    //Properties for this group (key-value pairs)
    getPropeties():IDict;
}
