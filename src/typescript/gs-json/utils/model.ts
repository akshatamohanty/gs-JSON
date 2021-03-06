import * as ifs from "./interfaces";
import {Arr} from "./arr";
import {Geom, GeomPath} from "./geom";
import {Point, Polyline, Polymesh} from "./entities";
import {Vertex, Edge, Wire, Face} from "./topos";
import {Attrib} from "./attribs";
import {Group} from "./groups";

//model class
/**
* Model Class
*/
export class Model implements ifs.IModel{
    private metadata:ifs.IMetadata;
    private geom:ifs.IGeom;
    private attrib_types_dict:ifs.IAttribTypesDict;
    private groups_dict:ifs.IGroupsDict;
    /**
    * to be completed
    * @param
    * @return
    */
    constructor() {
        //create default metadata
        this.metadata = {filetype: "gs-json", version:  "0.1.1", crs:{"epsg":3857}, location: "+0-0"}
        //create an empty geometry array
        this.geom = new Geom(this);
        //create one attrib, called "position"
        this.attrib_types_dict = {objs:{}, points:{}, faces:{}, wires:{}, edges:{}, vertices:{} }
        //create empty groups dict
        this.groups_dict = {};
    }
    //Geom
    /**
    * to be completed
    * @param
    * @return
    */
    public getGeom():ifs.IGeom {
        return this.geom;
    }
    /**
    * to be completed
    * @param
    * @return
    */
    public setData(data:ifs.IModelData):void {
        this.geom = new Geom(this, data.points, data.objs);
        if (data.attribs) {
            for (let attrib_data of data.attribs) {
                let attrib:ifs.IAttrib = 
                    new Attrib(this, attrib_data.name, 
                        ifs.EGeomType[attrib_data.geom_type], 
                        ifs.EDataType[attrib_data.data_type], attrib_data.values);
                this.attrib_types_dict[attrib_data.geom_type][attrib_data.name] = attrib;  
            }
        }
        if (data.groups) {
            for (let group_data of data.groups) {
                let group:ifs.IGroup = new Group(this, group_data.name);
                this.groups_dict[group_data.name] = group; 
            }
        }
    }
    //Attribs
    /**
    * to be completed
    * @param
    * @return
    */
    public getAttribs(geom_type:ifs.EGeomType):ifs.IAttrib[] {
        let attrib_dict:ifs.IAttribDict =  this.attrib_types_dict[geom_type];
        return Object.keys(attrib_dict).map(key=>attrib_dict[key]);
    }
    /**
    * to be completed
    * @param
    * @return
    */
    public getAttrib(name:string, geom_type?:ifs.EGeomType):ifs.IAttrib {
        return this.attrib_types_dict[geom_type][name];
    }
    /**
    * to be completed
    * @param
    * @return
    */
    public addAttrib(name:string, geom_type:ifs.EGeomType, data_type:ifs.EDataType):ifs.IAttrib {
        let attrib:ifs.IAttrib = new Attrib(this, name, geom_type, data_type);
        this.attrib_types_dict[geom_type][name] = attrib;
        return attrib;
    }
    /**
    * to be completed
    * @param
    * @return
    */
    public delAttrib(name:string, geom_type:ifs.EGeomType):boolean {
        return delete this.attrib_types_dict[geom_type][name];
    }
    //Groups
    /**
    * to be completed
    * @param
    * @return
    */
    public getGroups():ifs.IGroup[] {
        return Object.keys(this.groups_dict).map(key=>this.groups_dict[key]);
    }
    /**
    * to be completed
    * @param
    * @return
    */
    public getGroup(name:string):ifs.IGroup {;
        return this.groups_dict[name];
    }
    /**
    * to be completed
    * @param
    * @return
    */
    public addGroup(name:string):ifs.IGroup {
        this.groups_dict[name] = new Group(this, name);
        return this.groups_dict[name];
    }
    /**
    * to be completed
    * @param
    * @return
    */
    public delGroup(name:string):boolean {
        return delete this.groups_dict[name];
    }
    //Clean up nulls and unused points
    /**
    * to be completed
    * @param
    * @return
    */
    public purgePoints():number {
        throw new Error ("Method not implemented.");
    }
    /**
    * to be completed
    * @param
    * @return
    */
    public purgeNulls():number {
        throw new Error ("Method not implemented.");
    }
    //Runs some checks
    /**
    * to be completed
    * @param
    * @return
    */
    public validateModel():boolean {
        throw new Error ("Method not implemented.");
    }
}
