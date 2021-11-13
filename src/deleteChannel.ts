import { Bot } from "../deps.ts";
import { requireBotGuildPermissions } from "./permissions.ts";

export default function deleteChannel(bot: Bot) {
  const deleteChannelOld = bot.helpers.deleteChannel;

  bot.helpers.deleteChannel = async function (channelId, reason) {
    const channel = await bot.cache.channels.get(channelId);

    if (channel?.guildId) {
      const guild = await bot.cache.guilds.get(channel.guildId);
      if (!guild) throw new Error("GUILD_NOT_FOUND");

      if (guild.rulesChannelId === channelId) {
        throw new Error("RULES_CHANNEL_CANNOT_BE_DELETED");
      }

      if (guild.publicUpdatesChannelId === channelId) {
        throw new Error("UPDATES_CHANNEL_CANNOT_BE_DELETED");
      }

      await requireBotGuildPermissions(bot, guild, ["MANAGE_CHANNELS"]);
    }

    return deleteChannelOld(channelId, reason);
  };
}
