import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { IOOTCore } from "modloader64_api/OOT/OOTAPI";
import { EventHandler } from "modloader64_api/EventHandler";
import {OotOnlineEvents, OotOnline_Emote} from '@OotOnline/OotoAPI/OotoAPI';

export class EmoteManager{
    private emote_trigger: number = 0x6011F0;
    isCurrentlyPlayingEmote: boolean = false;
    currentEmoteID: number = -1;
    currentEmoteFrame: number = 0;
    masterEmoteList: Array<anim_binary_container> = [];
    ModLoader: IModLoaderAPI;
    core: IOOTCore;

    constructor(ModLoader: IModLoaderAPI, core: IOOTCore){
        this.ModLoader = ModLoader;
        this.core = core;
    }

    @EventHandler(OotOnlineEvents.ON_REGISTER_EMOTE)
    onRegisterEmote(emote: OotOnline_Emote){
        this.masterEmoteList.push(new anim_binary_container(emote.buf));
    }

    onTick(){
        if (this.isCurrentlyPlayingEmote){
            this.core.link.redeadFreeze = 0x3;
            this.core.link.anim_data = this.masterEmoteList[this.currentEmoteID].readAnimFrame(this.currentEmoteFrame);
            this.currentEmoteFrame++;
            if (this.currentEmoteFrame > this.masterEmoteList[this.currentEmoteID].getTotalFrames()){
                this.isCurrentlyPlayingEmote = false;
                this.core.link.redeadFreeze = 0x0;
            }
        }else{
            let em: number = this.ModLoader.emulator.rdramRead8(this.emote_trigger);
            if (em !== 0xFF){
                this.currentEmoteID = em;
                this.ModLoader.emulator.rdramWrite8(this.emote_trigger, 0xFF);
                this.currentEmoteFrame = 0;
                this.isCurrentlyPlayingEmote = true;
            }
        }
    }
}

export class anim_binary_container{

    data: Buffer;

    constructor(buf: Buffer){
        this.data = buf;
    }

    getTotalFrames(){
        return this.data.byteLength / 0x86;
    }

    readAnimFrame(frame: number){
        return this.data.slice((frame * 0x86), (frame * 0x86) + 0x86);
    }
}