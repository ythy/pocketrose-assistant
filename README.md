# pocketrose-assistant-ts

### 版本 3.0.7

1. 删除装备管理中的收藏按钮，功能有点过于复杂造成代码逻辑不清晰。

### 版本 3.0.6

1. 修复宠物管理的BUG，没有黄金笼子也能执行入笼操作并导致宠物消失。

### 版本 3.0.5

1. 野外简易驿站功能，能移动到地图上任意选定的坐标。
2. 城市主页面收益背景改为更加友好的绿色。
3. 恢复宠物图鉴界面的文本统计信息。
4. 设置项可隐藏城市主页面出城按钮，单击城市图片可恢复显示。

### 版本 3.0.4

1. 本国（非在野）城市收益超过5万后显示样式改变，双击触发收益。
2. 快速登陆功能，设置中启用，然后自行设置登陆账号后在登录页可以快捷登陆。

### 版本 3.0.3

1. 事件屏处理器结构初步完成。
2. 当发生人质失踪事件时，根据密语定位可疑的城市及相关的坐标并显示在事件屏上。
3. 隐藏枫丹的收益。
4. 移动模式的地图中，城市背景色读取城市情报按照不过的所属自动填充。
5. 城堡主页面菜单项调整。
6. 城堡仓库界面使用Ajax重构。

### 版本 3.0.2

1. 城市主页面、地图主页面、城堡主页面、势力图的事件面板重新格式化渲染。
2. 修复部分页面中破掉的宝石图片。
3. 紧急修复：修复当前页面文本的错误读取，之前导致了冒险家公会进入错误和主页面渲染错误。

### 版本 3.0.0

1. 使用TypeScript重写口袋助手，代码结构优化。
2. 口袋助手设置迁移完成。
3. 战斗推荐系统迁移完成。
4. 驿站系统迁移完成，全新的地图移动模式。
5. 冒险家公会迁移完成。
6. 装备管理迁移完成，提供与百宝袋的联动。
7. 宠物管理迁移完成，提供与黄金笼子的联动。
8. 职业管理迁移完成。
9. 修复战斗入手提示的判断错误的BUG，使用了正常战斗的判断条件。
10. 如果有网络请求错误发生的时候，尽可能在消息面板发布错误消息。
11. 设置项：经验是否使用进度条显示。

### 版本 3.0.0.RC2

1. 装备管理界面，单击饭饭头像可以出现祭奠按钮，自动取钱并祭奠选定的装备。
2. 祭奠按钮出现前，会检查祭奠战数是否已经冷却完成。
3. 移除首页的临时按钮。

### 版本 3.0.0.RC1

1. 使用ts重新实现。
2. 助手主要功能迁移完成。
3. 移动界面完全改版，支持地图模式。