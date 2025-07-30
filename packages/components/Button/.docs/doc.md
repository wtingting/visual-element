# 需求分析文档（Button 组件）

## 1. 用户调研摘要
| 维度 | 主要发现 |
|---|---|
| **用户画像** | • 前端开发者（Vue3 / React）<br>• 设计师 / 设计系统维护者<br>• 低代码平台搭建者 |
| **使用场景** | • 中后台管理后台表单、表格操作<br>• 营销页面 CTA 按钮<br>• 移动端 H5 混合应用 |
| **高频需求** | • 快速配置主题色、圆角、尺寸<br>• 一键切换禁用 / 加载态<br>• 可组合图标、文字、加载动画 |

## 2. 竞品对比报告
| 竞品 | 优势 | 不足 | 借鉴点 |
|---|---|---|---|
| **Ant Design Vue** | 提供 danger/ghost 类型、block 属性 | 自定义颜色需覆盖 less 变量 | ghost 风格、block 布局 |
| **Naive UI** | 支持 color 对象写法、预设 dark 模式 | 图标插槽不够灵活 | color 对象+算法生成 hover/active |
| **Vuetify3** | ripple 动效、elevation 层级 | 包体大，tree-shaking 一般 | elevation 动效可选 |
| **Element Plus 现状** | API 简洁，文档丰富，主题定制 beta | 暂无 danger/ghost 类型；loading 插槽优先级文档不清晰 | 保持 API 简洁，补齐视觉类型 |

## 3. 市场趋势分析
| 趋势 | 说明 | 对 Button 组件的启示 |
|---|---|---|
| **Design Token 化** | 颜色、圆角、间距抽象为 token | 支持通过 token 注入自定义颜色，减少 CSS 覆盖 |
| **Dark Mode 标配** | 90% 设计系统提供一键切换 | dark 属性已支持，需与全局模式联动 |
| **无障碍合规** | WCAG 2.2 2025 全面落地 | `aria-busy`、`aria-disabled` 自动绑定；键盘焦点环 |
| **微交互增强** | loading/ripple/scale feedback | loading 插槽开放更高自定义；可选 ripple 动效开关 |

## 4. 用户痛点
1. **主题切换繁琐**：必须写额外 CSS 变量才能覆盖主色。  
2. **加载状态耦合**：loading 图标无法替换为业务品牌动画。  
3. **语义化不足**：缺少 danger/ghost 类型导致二次封装。  
4. **无障碍缺位**：未自动输出 ARIA 状态，测试需手动补。  
5. **移动端体验**：圆角与尺寸对触达面积支持不友好。

## 5. 期望功能
| 优先级 | 功能 | 简述 |
|---|---|---|
| P0 | **Color Token 注入** | 通过 config-provider 全局注入自定义颜色并自动生成 hover / active |
| P0 | **danger/ghost 类型** | 原生支持语义化样式，减少二次封装 |
| P1 | **loading 插槽增强** | loading 插槽优先级说明 + 示例；支持 skeleton 动画 |
| P1 | **无障碍默认化** | 自动生成 `aria-disabled`, `aria-busy`, `role="button"` |
| P2 | **触达面积优化** | 新增 `block` 属性占满父级；`touchable` 属性增大点击热区 |
| P2 | **ripple 动效** | 可选开关，移动端反馈 |

## 6. 安全性需求
- **XSS 防护**：所有插槽（icon / loading / default）默认使用 v-bind 非 v-html。  
- **禁用态不可点击**：`disabled` 时移除 `tabindex`，防止键盘触发。  
- **色弱模式**：自定义颜色需满足 WCAG 对比度≥4.5:1，提供校验工具。