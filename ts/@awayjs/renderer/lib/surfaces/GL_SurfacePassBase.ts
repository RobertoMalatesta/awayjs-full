import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {ImageBase}					from "@awayjs/core/lib/image/ImageBase";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";

import {Camera}						from "@awayjs/display/lib/display/Camera";

import {AnimationSetBase}				from "../animators/AnimationSetBase";
import {PassEvent}					from "../events/PassEvent";
import {ShaderBase}					from "../shaders/ShaderBase";
import {ShaderRegisterCache}			from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData}			from "../shaders/ShaderRegisterData";
import {IPass}						from "../surfaces/passes/IPass";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {GL_SurfaceBase}				from "../surfaces/GL_SurfaceBase";

/**
 * GL_SurfacePassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
export class GL_SurfacePassBase extends GL_SurfaceBase implements IPass
{
	public _shader:ShaderBase;

	public get shader():ShaderBase
	{
		return this._shader;
	}

	public get animationSet():AnimationSetBase
	{
		return <AnimationSetBase> this._surface.animationSet;
	}

	/**
	 * Marks the shader program as invalid, so it will be recompiled before the next render.
	 */
	public invalidate():void
	{
		this._shader.invalidateProgram();

		this.dispatchEvent(new PassEvent(PassEvent.INVALIDATE, this));
	}

	public dispose():void
	{
		if (this._shader) {
			this._shader.dispose();
			this._shader = null;
		}
	}

	/**
	 * Renders the current pass. Before calling pass, activatePass needs to be called with the same index.
	 * @param pass The pass used to render the renderable.
	 * @param renderable The IRenderable object to draw.
	 * @param stage The Stage object used for rendering.
	 * @param entityCollector The EntityCollector object that contains the visible scene data.
	 * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
	 * camera.viewProjection as it includes the scaling factors when rendering to textures.
	 *
	 * @internal
	 */
	public _setRenderState(renderable:GL_RenderableBase, camera:Camera, viewProjection:Matrix3D):void
	{
		this._shader._setRenderState(renderable, camera, viewProjection);
	}

	/**
	 * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
	 * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
	 * @param stage The Stage object which is currently used for rendering.
	 * @param camera The camera from which the scene is viewed.
	 * @private
	 */
	public _iActivate(camera:Camera):void
	{
		this._shader._iActivate(camera);
	}

	/**
	 * Clears the render state for the pass. This needs to be called before activating another pass.
	 * @param stage The Stage used for rendering
	 *
	 * @private
	 */
	public _iDeactivate():void
	{
		this._shader._iDeactivate();
	}

	public _iInitConstantData(shader:ShaderBase):void
	{

	}

	public _iGetPreLightingVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetPreLightingFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetNormalVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetNormalFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}
}