
// 聊天过滤，也称敏感词过滤

import { BaseCtrl } from "modules/common/BaseCtrl";
import { config_filter_list } from "./config_filter_list";
export enum WordFilterType {
	CHAT = 1,            //聊天
	ROLE_NAME = 2,       //改名
	GUILD_NAME = 3,      //公会
	GUILD_NOTICE = 4,     //公会公告
}
export class ChatFilter extends BaseCtrl {
	protected initCtrl() {

	}

	//是否含有非法字符
	IsIllegal(content: string, is_username = false) {
		const matchList = this.GetMatchList(content);
		return matchList.length > 0
	}

	//获取匹配列表
	GetMatchList(content: string, filter_list = config_filter_list) {
		const regex = /[&\s]/g
		const normalizedText = content.replace(regex, ""); // 去除文本中的空格和"&"
		let match
		const positions: number[] = [];

		while ((match = regex.exec(content)) !== null) {
			positions.push(match.index);
		}

		let matchList: any[] = []
		for (let i = 0; i < filter_list.length; i++) {
			const filterWord = filter_list[i]
			const list = this.containsFilterWords(normalizedText, filterWord, positions)
			if (list.length > 0) {
				matchList = matchList.concat(list)
			}
		}
		return matchList
	}

	//获取匹配信息
	private containsFilterWords(normalizedText: string, filterWord: string, positions: number[]) {
		const matchList = [];

		let startIndex = -1;
		let endIndex = -1;
		let currentPosition = 0;

		while ((startIndex = normalizedText.indexOf(filterWord, currentPosition)) !== -1) {
			endIndex = startIndex + filterWord.length - 1;
			let startReal = startIndex
			let endReal = endIndex
			for (let element of positions) {
				if (startReal >= element) {
					startReal++
				}
				if (endReal >= element) {
					endReal++
				}
			}
			matchList.push({ start: startReal, end: endReal });
			currentPosition = endIndex + 1;
		}
		return matchList;
	}

	//过滤敏感名，将过敏感词用*号代替
	ChatFilter(content: string) {
		const matchList = this.GetMatchList(content);
		for (const match of matchList) {
			const censoredWord = "*".repeat(match.end - match.start + 1);
			content = content.substring(0, match.start) + censoredWord + content.substring(match.end + 1);
		}
		return content;
	}

}