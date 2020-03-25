/*
 * File generated by Interface generator (dotup.dotup-vscode-interface-generator)
 * Date: 2020-03-02 22:45:43 
*/
import { Age } from "modloader64_api/OOT/OOTAPI";
import { INetworkPlayer, IPacketHeader } from "modloader64_api/NetworkHandler";
import { IPuppet } from "@OotOnline/OotoAPI/IPuppet";

export interface IPuppetOverlord {
    readonly current_scene: number;
    postinit(): void;
    localPlayerLoadingZone(): void;
    localPlayerChangingScenes(entering_scene: number, age: Age): void;
    registerPuppet(player: INetworkPlayer): void;
    unregisterPuppet(player: INetworkPlayer): void;
    changePuppetScene(player: INetworkPlayer, entering_scene: number, age: Age): void;
    processNewPlayers(): void;
    processAwaitingSpawns(): void;
    lookForMissingOrStrandedPuppets(): void;
    sendPuppetPacket(): void;
    processPuppetPacket(packet: IPacketHeader): void;
    generateCrashDump(): void;
    onTick(): void;
}
