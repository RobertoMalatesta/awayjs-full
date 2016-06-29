import {Box}							from "@awayjs/core/lib/geom/Box";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {PlaneClassification}			from "@awayjs/core/lib/geom/PlaneClassification";
import {Plane3D}						from "@awayjs/core/lib/geom/Plane3D";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {ElementsType}					from "../graphics/ElementsType";
import {BoundingVolumeBase}			from "../bounds/BoundingVolumeBase";
import {IEntity}						from "../display/IEntity";
import {Sprite}						from "../display/Sprite";
import {PrimitiveCubePrefab}			from "../prefabs/PrimitiveCubePrefab";


/**
 * AxisAlignedBoundingBox represents a bounding box volume that has its planes aligned to the local coordinate axes of the bounded object.
 * This is useful for most sprites.
 */
export class AxisAlignedBoundingBox extends BoundingVolumeBase
{
	public _box:Box;
	private _x:number = 0;
	private _y:number = 0;
	private _z:number = 0;
	private _width:number = 0;
	private _height:number = 0;
	private _depth:number = 0;
	private _centerX:number = 0;
	private _centerY:number = 0;
	private _centerZ:number = 0;
	private _halfExtentsX:number = 0;
	private _halfExtentsY:number = 0;
	private _halfExtentsZ:number = 0;
	private _prefab:PrimitiveCubePrefab;

	/**
	 * Creates a new <code>AxisAlignedBoundingBox</code> object.
	 */
	constructor(entity:IEntity)
	{
		super(entity);
	}

	/**
	 * @inheritDoc
	 */
	public nullify():void
	{
		this._x = this._y = this._z = 0;
		this._width = this._height = this._depth = 0;
		this._centerX = this._centerY = this._centerZ = 0;
		this._halfExtentsX = this._halfExtentsY = this._halfExtentsZ = 0;
	}

	/**
	 * @inheritDoc
	 */
	public isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean
	{
		if(this._pInvalidated)
			this._pUpdate();

		for (var i:number = 0; i < numPlanes; ++i) {

			var plane:Plane3D = planes[i];
			var a:number = plane.a;
			var b:number = plane.b;
			var c:number = plane.c;
			var flippedExtentX:number = a < 0? -this._halfExtentsX : this._halfExtentsX;
			var flippedExtentY:number = b < 0? -this._halfExtentsY : this._halfExtentsY;
			var flippedExtentZ:number = c < 0? -this._halfExtentsZ : this._halfExtentsZ;
			var projDist:number = a*(this._centerX + flippedExtentX) + b*(this._centerY + flippedExtentY) + c*(this._centerZ + flippedExtentZ) - plane.d;

			if (projDist < 0)
				return false;
		}

		return true;
	}

	public rayIntersection(position:Vector3D, direction:Vector3D, targetNormal:Vector3D):number
	{
		if(this._pInvalidated)
			this._pUpdate();

		return this._box.rayIntersection(position, direction, targetNormal);
	}



	public classifyToPlane(plane:Plane3D):number
	{
		var a:number = plane.a;
		var b:number = plane.b;
		var c:number = plane.c;
		var centerDistance:number = a*this._centerX + b*this._centerY + c*this._centerZ - plane.d;

		if (a < 0)
			a = -a;

		if (b < 0)
			b = -b;

		if (c < 0)
			c = -c;

		var boundOffset:number = a*this._halfExtentsX + b*this._halfExtentsY + c*this._halfExtentsZ;

		return centerDistance > boundOffset? PlaneClassification.FRONT : centerDistance < -boundOffset? PlaneClassification.BACK : PlaneClassification.INTERSECT;
	}

	public _pUpdate():void
	{
		super._pUpdate();

		this._box = this._pEntity.getBox();
		var matrix:Matrix3D = this._pEntity.sceneTransform;
		var hx:number = this._box.width/2;
		var hy:number = this._box.height/2;
		var hz:number = this._box.depth/2;
		var cx:number = this._box.x + hx;
		var cy:number = this._box.y + hy;
		var cz:number = this._box.z + hz;
		var raw:Float32Array = matrix.rawData;

		var m11:number = raw[0], m12:number = raw[4], m13:number = raw[8], m14:number = raw[12];
		var m21:number = raw[1], m22:number = raw[5], m23:number = raw[9], m24:number = raw[13];
		var m31:number = raw[2], m32:number = raw[6], m33:number = raw[10], m34:number = raw[14];

		this._centerX = cx*m11 + cy*m12 + cz*m13 + m14;
		this._centerY = cx*m21 + cy*m22 + cz*m23 + m24;
		this._centerZ = cx*m31 + cy*m32 + cz*m33 + m34;

		this._halfExtentsX = Math.abs(hx*m11 + hy*m12 + hz*m13);
		this._halfExtentsY = Math.abs(hx*m21 + hy*m22 + hz*m23);
		this._halfExtentsZ = Math.abs(hx*m31 + hy*m32 + hz*m33);

		if (this._prefab) {
			this._prefab.width = this._box.width;
			this._prefab.height = this._box.height;
			this._prefab.depth = this._box.depth;
			this._pBoundsPrimitive.transform.matrix3D = matrix;
		}

		this._width = this._halfExtentsX*2;
		this._height = this._halfExtentsY*2;
		this._depth = this._halfExtentsZ*2;

		this._x = this._centerX - this._halfExtentsX;
		this._y = this._centerY - this._halfExtentsY;
		this._z = this._centerZ - this._halfExtentsZ;
	}

	public _pCreateBoundsPrimitive():Sprite
	{
		this._prefab = new PrimitiveCubePrefab(null, ElementsType.LINE);

		return <Sprite> this._prefab.getNewObject();
	}
}