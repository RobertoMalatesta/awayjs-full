import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";
import {AssetBase}					from "@awayjs/core/lib/library/AssetBase";

import {IEntity}						from "../../display/IEntity";
import {LightBase}					from "../../display/LightBase";
import {DirectionalLight}				from "../../display/DirectionalLight";
import {LightProbe}					from "../../display/LightProbe";
import {PointLight}					from "../../display/PointLight";

/**
 * LightPickerBase provides an abstract base clase for light picker classes. These classes are responsible for
 * feeding materials with relevant lights. Usually, StaticLightPicker can be used, but LightPickerBase can be
 * extended to provide more application-specific dynamic selection of lights.
 *
 * @see StaticLightPicker
 */
export class LightPickerBase extends AssetBase
{
	public static assetType:string = "[asset LightPicker]";

	public _pNumPointLights:number = 0;
	public _pNumDirectionalLights:number = 0;
	public _pNumCastingPointLights:number = 0;
	public _pNumCastingDirectionalLights:number = 0;
	public _pNumLightProbes:number = 0;

	public _pAllPickedLights:Array<LightBase>;
	public _pPointLights:Array<PointLight>;
	public _pCastingPointLights:Array<PointLight>;
	public _pDirectionalLights:Array<DirectionalLight>;
	public _pCastingDirectionalLights:Array<DirectionalLight>;
	public _pLightProbes:Array<LightProbe>;
	public _pLightProbeWeights:Array<number>;

	/**
	 * Creates a new LightPickerBase object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * Disposes resources used by the light picker.
	 */
	public dispose():void
	{
	}

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return LightPickerBase.assetType;
	}

	/**
	 * The maximum amount of directional lights that will be provided.
	 */
	public get numDirectionalLights():number
	{
		return this._pNumDirectionalLights;
	}

	/**
	 * The maximum amount of point lights that will be provided.
	 */
	public get numPointLights():number
	{
		return this._pNumPointLights;
	}

	/**
	 * The maximum amount of directional lights that cast shadows.
	 */
	public get numCastingDirectionalLights():number
	{
		return this._pNumCastingDirectionalLights;
	}

	/**
	 * The amount of point lights that cast shadows.
	 */
	public get numCastingPointLights():number
	{
		return this._pNumCastingPointLights;
	}

	/**
	 * The maximum amount of light probes that will be provided.
	 */
	public get numLightProbes():number
	{
		return this._pNumLightProbes;
	}

	/**
	 * The collected point lights to be used for shading.
	 */
	public get pointLights():Array<PointLight>
	{
		return this._pPointLights;
	}

	/**
	 * The collected directional lights to be used for shading.
	 */
	public get directionalLights():Array<DirectionalLight>
	{
		return this._pDirectionalLights;
	}

	/**
	 * The collected point lights that cast shadows to be used for shading.
	 */
	public get castingPointLights():Array<PointLight>
	{
		return this._pCastingPointLights;
	}

	/**
	 * The collected directional lights that cast shadows to be used for shading.
	 */
	public get castingDirectionalLights():Array<DirectionalLight>
	{
		return this._pCastingDirectionalLights;
	}

	/**
	 * The collected light probes to be used for shading.
	 */
	public get lightProbes():Array<LightProbe>
	{
		return this._pLightProbes;
	}

	/**
	 * The weights for each light probe, defining their influence on the object.
	 */
	public get lightProbeWeights():Array<number>
	{
		return this._pLightProbeWeights;
	}

	/**
	 * A collection of all the collected lights.
	 */
	public get allPickedLights():Array<LightBase>
	{
		return this._pAllPickedLights;
	}

	/**
	 * Updates set of lights for a given renderable and EntityCollector. Always call super.collectLights() after custom overridden code.
	 */
	public collectLights(entity:IEntity):void
	{
		this.updateProbeWeights(entity);
	}

	/**
	 * Updates the weights for the light probes, based on the renderable's position relative to them.
	 * @param renderable The renderble for which to calculate the light probes' influence.
	 */
	private updateProbeWeights(entity:IEntity):void
	{
		// todo: this will cause the same calculations to occur per TriangleGraphic. See if this can be improved.
		var objectPos:Vector3D = entity.scenePosition;
		var lightPos:Vector3D;

		var rx:number = objectPos.x, ry:number = objectPos.y, rz:number = objectPos.z;
		var dx:number, dy:number, dz:number;
		var w:number, total:number = 0;
		var i:number;

		// calculates weights for probes
		for (i = 0; i < this._pNumLightProbes; ++i) {

			lightPos = this._pLightProbes[i].scenePosition;
			dx = rx - lightPos.x;
			dy = ry - lightPos.y;
			dz = rz - lightPos.z;
			// weight is inversely proportional to square of distance
			w = dx*dx + dy*dy + dz*dz;

			// just... huge if at the same spot
			w = w > .00001? 1/w : 50000000;
			this._pLightProbeWeights[i] = w;
			total += w;
		}

		// normalize
		total = 1/total;

		for (i = 0; i < this._pNumLightProbes; ++i)
			this._pLightProbeWeights[i] *= total;
	}
}