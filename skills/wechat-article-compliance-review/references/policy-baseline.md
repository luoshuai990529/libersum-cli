# 公众号文章审核规则基线

用于 `wechat-article-compliance-review` 的逐项归因。规则会更新；审核报告引用编号与链接，不把本文件当作法律意见。

| 编号 | 触发信号 | 审核判断 | 官方来源 |
| --- | --- | --- | --- |
| WL-1 | 转发、分享、集赞、红包、积分、抽奖换取内容或机会 | 利益诱导分享，通常为阻断/高风险。 | [《微信公众平台运营规范》§3.3.1](https://mp.weixin.qq.com/publicpoc/opshowpage?action=newoplaw) |
| WL-2 | 关注后才能看全文、领资源、解锁结果或取得奖励 | 诱导关注；删除前置条件并让核心内容独立可读。 | [运营规范 §3.3.2](https://mp.weixin.qq.com/publicpoc/opshowpage?action=newoplaw) |
| WL-3 | 空壳正文、擦边标题/封面、仿系统提示、无效内容配文字链/图片链/小程序卡片 | 若主要目的是骗取点击或导向其他图文/页面，按违规导流处理。文章互链本身不是自动违规。 | [运营规范 §3.3.3、§3.16](https://mp.weixin.qq.com/publicpoc/opshowpage?action=newoplaw) |
| WL-4 | “展开全文”“领取”“播放”等文案实际跳下载页、外部 App 或无关页；弹窗或频繁提示强制跳转 | 链接承诺与实际不一致、强制跳转，属外链高风险。 | [《微信外部链接内容管理规范》§2.3.2–§2.3.3](https://weixin.qq.com/agreement/weixin_external_links_content_management_specification) |
| CT-1 | 钓鱼、病毒、赌博、色情、欺诈、违法交易；特殊符号或图片规避审核 | 阻断；同一外链落地页也应检查。 | [运营规范 §3.13.4、§4.2–§4.7](https://mp.weixin.qq.com/publicpoc/opshowpage?action=newoplaw) |
| CT-2 | 虚构故事、绝对化功效/收益、虚假稀缺、假借专家或机构背书 | 夸大或虚假营销。金融、医疗等同时标“需专项核验”。 | [运营规范 §4.8](https://mp.weixin.qq.com/publicpoc/opshowpage?action=newoplaw) |
| AD-1 | 第三方商品或服务推广、带货、合作链接、返佣或购买入口 | 核实是否构成广告；广告标识、平台审核和特殊广告审查是独立条件。 | [运营规范 §4.20](https://mp.weixin.qq.com/publicpoc/opshowpage?action=newoplaw) |
| IP-1 | 转载、截图、图片、品牌、他人文章、商业秘密或个人信息 | 要求授权或合法使用依据；不能导向假冒/盗版交易。 | [运营规范 §4.1](https://mp.weixin.qq.com/publicpoc/opshowpage?action=newoplaw) |
| OR-1 | 原创声明 | 仅限自行创作、受著作权保护且不侵权内容；营销宣传或搬运/导流不得滥用。 | [运营规范 §3.6.1](https://mp.weixin.qq.com/publicpoc/opshowpage?action=newoplaw) |
| IN-1 | 国内时事、公共政策、社会事件 | 正文开头或结尾用单独一行标明可追溯的官方来源全称；“网传”“互联网”不足。 | [运营规范 §4.24.1](https://mp.weixin.qq.com/publicpoc/opshowpage?action=newoplaw) |
| AI-1 | 生成式 AI 制作或发布的合成内容 | 检查显著标识与真实性表述；AI 参与不免除其余责任。 | [运营规范 §4.24.2](https://mp.weixin.qq.com/publicpoc/opshowpage?action=newoplaw) |
| PR-1 | 请求微信号、手机号、关系链或外链收集用户信息 | 审查必要性、告知和安全性；不把隐私收集当作导流工具。 | [运营规范 §4.16、§5.1](https://mp.weixin.qq.com/publicpoc/opshowpage?action=newoplaw) |

## 审核外的验证

以下结论必须保留为待核验项：正文是否允许某种超链接、文章链接可选范围、外链白名单/数量上限、小程序卡片资格、手机端实际跳转和落地页行为。它们取决于目标账号后台与发布时产品规则，不能由文稿审核推断。
