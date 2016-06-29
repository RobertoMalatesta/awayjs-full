import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {PlaneClassification}			from "@awayjs/core/lib/geom/PlaneClassification";
import {Plane3D}						from "@awayjs/core/lib/geom/Plane3D";
import {Sphere}						from "@awayjs/core/lib/geom/Sphere";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {ElementsType}					from "../graphics/ElementsType";
import {BoundingVolumeBase}			from "../bounds/BoundingVolumeBase";
import {IEntity}						from "../display/IEntity";
import {Sprite}						from "../display/Sprite";
import {PrimitiveSpherePrefab}		from "../prefabs/PrimitiveSpherePrefab";

export class BoundingSphere extends BoundingVolumeBase
{
	private _sphere:Sphere;
	private _radius:number = 0;
	private _centerX:number = 0;
	private _centerY:number = 0;
	private _centerZ:number = 0;
	private _prefab:PrimitiveSpherePrefab;

	constructor(entity:IEntity)
	{
		super(entity);
	}

	public nullify():void
	{
		this._centerX = this._centerY = this._centerZ = 0;
		this._radius = 0;
	}

	public isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean
	{
		if(this._pInvalidated)
			this._pUpdate();

		for (var i:number = 0; i < numPlanes; ++i) {
			var plane:Plane3D = planes[i];
			var flippedExtentX:number = plane.a < 0? -this._radius : this._radius;
			var flippedExtentY:number = plane.b < 0? -this._radius : this._radius;
			var flippedExtentZ:number = plane.c < 0? -this._radius : this._radius;
			var projDist:number = plane.a*( this._centerX + flippedExtentX ) + plane.b*( this._centerY + flippedExtentY) + plane.c*( this._centerZ + flippedExtentZ ) - plane.d;
			if (projDist < 0) {
				return false;
			}
		}
		return true;
	}

	public rayIntersection(position:Vector3D, direction:Vector3D, targetNormal:Vector3D):number
	{
		if(this._pInvalidated)
			this._pUpdate();

		return this._sphere.rayIntersection(position, direction, targetNormal);
	}

	//@override
	public classifyToPlane(plane:Plane3D):number
	{
		var a:number = plane.a;
		var b:number = plane.b;
		var c:number = plane.c;
		var dd:number = a*this._centerX + b*this._centerY + c*this._centerZ - plane.d;

		if (a < 0)
			a = -a;

		if (b < 0)
			b = -b;

		if (c < 0)
			c = -c;

		var rr:Number = (a + b + c)*this._radius;

		return dd > rr? PlaneClassification.FRONT : dd < -rr? PlaneClassification.BACK : PlaneClassification.INTERSECT;
	}

	public _pUpdate():void
	{
		super._pUpdate();

		this._sphere = this._pEntity.getSphere();
		var matrix:Matrix3D = this._pEntity.sceneTransform;

		var cx:number = this._sphere.x;
		var cy:number = this._sphere.y;
		var cz:number = this._sphere.z;
		var r:number = this._sphere.radius;

		var raw:Float32Array = matrix.rawData;

		var m11:number = raw[0], m12:number = raw[4], m13:number = raw[8], m14:number = raw[12];
		var m21:number = raw[1], m22:number = raw[5], m23:number = raw[9], m24:number = raw[13];
		var m31:number = raw[2], m32:number = raw[6], m33:number = raw[10], m34:number = raw[14];

		this._centerX = cx*m11 + cy*m12 + cz*m13 + m14;
		this._centerY = cx*m21 + cy*m22 + cz*m23 + m24;
		this._centerZ = cx*m31 + cy*m32 + cz*m33 + m34;

		var rx:number = m11 + m12 + m13;
		var ry:number = m21 + m22 + m23;
		var rz:number = m31 + m32 + m33;
		this._radius = r*Math.sqrt((rx*rx + ry*ry + rz*rz)/3);

		if (this._prefab) {
			this._prefab.radius = r;
			this._pBoundsPrimitive.x = cx;
			this._pBoundsPrimitive.y = cy;
			this._pBoundsPrimitive.z = cz;
			this._pBoundsPrimitive.transform.matrix3D = matrix;
		}
	}

	public _pCreateBoundsPrimitive():Sprite
	{
		this._prefab = new PrimitiveSpherePrefab(null, ElementsType.LINE);

		return <Sprite> this._prefab.getNewObject();
	}
}