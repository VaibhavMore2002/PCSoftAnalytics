# Backend API Reference

Generated from `./openapi.json`.

- OpenAPI title: **PCSoft Analytics**
- Version: **1.0.0**
- Total paths: **258**
- Total operations: **360**

## Quick Index

1. `POST` `/api/v1/admin/migrate-preferences` - `migrate_preferences_to_views_api_v1_admin_migrate_preferences_post`
2. `POST` `/api/v1/admin/reset-sync-state` - `reset_sync_state_api_v1_admin_reset_sync_state_post`
3. `GET` `/api/v1/admin/sync-status` - `get_sync_status_summary_api_v1_admin_sync_status_get`
4. `POST` `/api/v1/ai-assistant/attach-context` - `attach_context_api_v1_ai_assistant_attach_context_post`
5. `POST` `/api/v1/ai-assistant/chat` - `chat_api_v1_ai_assistant_chat_post`
6. `GET` `/api/v1/ai-assistant/contexts` - `get_available_contexts_api_v1_ai_assistant_contexts_get`
7. `GET` `/api/v1/ai-assistant/conversation/{conversation_id}` - `get_conversation_with_messages_api_v1_ai_assistant_conversation__conversation_id__get`
8. `DELETE` `/api/v1/ai-assistant/conversation/{conversation_id}` - `delete_conversation_api_v1_ai_assistant_conversation__conversation_id__delete`
9. `POST` `/api/v1/ai-assistant/generate-insights` - `generate_insights_api_v1_ai_assistant_generate_insights_post`
10. `GET` `/api/v1/ai-assistant/health` - `health_check_api_v1_ai_assistant_health_get`
11. `GET` `/api/v1/ai-assistant/history` - `get_conversation_history_api_v1_ai_assistant_history_get`
12. `POST` `/api/v1/alerts/check` - `check_all_alert_rules_api_v1_alerts_check_post`
13. `GET` `/api/v1/alerts/history` - `get_alert_history_api_v1_alerts_history_get`
14. `GET` `/api/v1/alerts/history/{history_id}` - `get_alert_details_api_v1_alerts_history__history_id__get`
15. `POST` `/api/v1/alerts/history/{history_id}/feedback` - `provide_alert_feedback_api_v1_alerts_history__history_id__feedback_post`
16. `POST` `/api/v1/alerts/history/{history_id}/resolve` - `resolve_alert_api_v1_alerts_history__history_id__resolve_post`
17. `GET` `/api/v1/alerts/rules` - `list_alert_rules_api_v1_alerts_rules_get`
18. `POST` `/api/v1/alerts/rules` - `create_alert_rule_api_v1_alerts_rules_post`
19. `GET` `/api/v1/alerts/rules/{rule_id}` - `get_alert_rule_api_v1_alerts_rules__rule_id__get`
20. `PATCH` `/api/v1/alerts/rules/{rule_id}` - `update_alert_rule_api_v1_alerts_rules__rule_id__patch`
21. `DELETE` `/api/v1/alerts/rules/{rule_id}` - `delete_alert_rule_api_v1_alerts_rules__rule_id__delete`
22. `POST` `/api/v1/alerts/rules/{rule_id}/toggle` - `toggle_alert_rule_api_v1_alerts_rules__rule_id__toggle_post`
23. `GET` `/api/v1/analytics-expert/analytics` - `get_analytics_api_v1_analytics_expert_analytics_get`
24. `POST` `/api/v1/analytics-expert/chat` - `chat_api_v1_analytics_expert_chat_post`
25. `GET` `/api/v1/analytics-expert/conversations` - `get_conversations_api_v1_analytics_expert_conversations_get`
26. `GET` `/api/v1/analytics-expert/conversations/{conversation_id}` - `get_conversation_with_messages_api_v1_analytics_expert_conversations__conversation_id__get`
27. `POST` `/api/v1/analytics-expert/conversations/upload` - `upload_conversations_api_v1_analytics_expert_conversations_upload_post`
28. `GET` `/api/v1/analytics-expert/health` - `health_check_api_v1_analytics_expert_health_get`
29. `GET` `/api/v1/analytics-expert/status` - `get_status_api_v1_analytics_expert_status_get`
30. `POST` `/api/v1/analytics-expert/suggestions` - `get_suggestions_api_v1_analytics_expert_suggestions_post`
31. `POST` `/api/v1/analytics/feedback/interaction-outcome` - `record_interaction_outcome_api_v1_analytics_feedback_interaction_outcome_post`
32. `GET` `/api/v1/analytics/feedback/stats` - `get_learning_stats_api_v1_analytics_feedback_stats_get`
33. `POST` `/api/v1/analytics/feedback/submit` - `submit_feedback_api_v1_analytics_feedback_submit_post`
34. `GET` `/api/v1/analytics/query` - `run_analytics_query_api_v1_analytics_query_get`
35. `GET` `/api/v1/analytics/summary/{data_source_id}/{table_name}` - `get_summary_statistics_api_v1_analytics_summary__data_source_id___table_name__get`
36. `GET` `/api/v1/audit/audit` - `list_audit_logs_api_v1_audit_audit_get`
37. `GET` `/api/v1/audit/audit/actions` - `list_audit_actions_api_v1_audit_audit_actions_get`
38. `GET` `/api/v1/audit/audit/user/{user_id}` - `get_user_audit_logs_api_v1_audit_audit_user__user_id__get`
39. `POST` `/api/v1/auth/login` - `login_api_v1_auth_login_post`
40. `POST` `/api/v1/auth/logout` - `logout_api_v1_auth_logout_post`
41. `GET` `/api/v1/auth/me` - `read_users_me_api_v1_auth_me_get`
42. `GET` `/api/v1/columns/` - `list_columns_api_v1_columns__get`
43. `POST` `/api/v1/columns/` - `create_column_api_v1_columns__post`
44. `GET` `/api/v1/columns/{column_id}` - `get_column_api_v1_columns__column_id__get`
45. `PUT` `/api/v1/columns/{column_id}` - `update_column_api_v1_columns__column_id__put`
46. `DELETE` `/api/v1/columns/{column_id}` - `delete_column_api_v1_columns__column_id__delete`
47. `POST` `/api/v1/columns/bulk-sync-update` - `bulk_update_column_sync_api_v1_columns_bulk_sync_update_post`
48. `GET` `/api/v1/dashboards/` - `get_dashboards_api_v1_dashboards__get`
49. `POST` `/api/v1/dashboards/` - `create_dashboard_api_v1_dashboards__post`
50. `GET` `/api/v1/dashboards/{dashboard_id}` - `get_dashboard_api_v1_dashboards__dashboard_id__get`
51. `PUT` `/api/v1/dashboards/{dashboard_id}` - `update_dashboard_api_v1_dashboards__dashboard_id__put`
52. `DELETE` `/api/v1/dashboards/{dashboard_id}` - `delete_dashboard_api_v1_dashboards__dashboard_id__delete`
53. `GET` `/api/v1/dashboards/{dashboard_id}/access` - `list_dashboard_access_api_v1_dashboards__dashboard_id__access_get`
54. `POST` `/api/v1/dashboards/{dashboard_id}/access` - `grant_dashboard_access_api_v1_dashboards__dashboard_id__access_post`
55. `PUT` `/api/v1/dashboards/{dashboard_id}/access/{access_id}` - `update_dashboard_access_api_v1_dashboards__dashboard_id__access__access_id__put`
56. `DELETE` `/api/v1/dashboards/{dashboard_id}/access/{access_id}` - `revoke_dashboard_access_api_v1_dashboards__dashboard_id__access__access_id__delete`
57. `GET` `/api/v1/dashboards/{dashboard_id}/columns` - `get_dashboard_columns_api_v1_dashboards__dashboard_id__columns_get`
58. `GET` `/api/v1/dashboards/{dashboard_id}/data` - `get_dashboard_data_api_v1_dashboards__dashboard_id__data_get`
59. `POST` `/api/v1/dashboards/{dashboard_id}/duplicate` - `duplicate_dashboard_api_v1_dashboards__dashboard_id__duplicate_post`
60. `GET` `/api/v1/dashboards/{dashboard_id}/filter-sets` - `get_dashboard_filter_sets_api_v1_dashboards__dashboard_id__filter_sets_get`
61. `POST` `/api/v1/dashboards/{dashboard_id}/filter-sets` - `create_dashboard_filter_set_api_v1_dashboards__dashboard_id__filter_sets_post`
62. `PUT` `/api/v1/dashboards/{dashboard_id}/filter-sets/{filter_set_id}` - `update_dashboard_filter_set_api_v1_dashboards__dashboard_id__filter_sets__filter_set_id__put`
63. `DELETE` `/api/v1/dashboards/{dashboard_id}/filter-sets/{filter_set_id}` - `delete_dashboard_filter_set_api_v1_dashboards__dashboard_id__filter_sets__filter_set_id__delete`
64. `GET` `/api/v1/dashboards/{dashboard_id}/filters` - `get_dashboard_filters_api_v1_dashboards__dashboard_id__filters_get`
65. `POST` `/api/v1/dashboards/{dashboard_id}/filters` - `create_dashboard_filter_api_v1_dashboards__dashboard_id__filters_post`
66. `PUT` `/api/v1/dashboards/{dashboard_id}/filters/{filter_id}` - `update_dashboard_filter_api_v1_dashboards__dashboard_id__filters__filter_id__put`
67. `DELETE` `/api/v1/dashboards/{dashboard_id}/filters/{filter_id}` - `delete_dashboard_filter_api_v1_dashboards__dashboard_id__filters__filter_id__delete`
68. `PUT` `/api/v1/dashboards/{dashboard_id}/layout` - `update_dashboard_layout_api_v1_dashboards__dashboard_id__layout_put`
69. `GET` `/api/v1/dashboards/{dashboard_id}/me/access` - `get_my_dashboard_access_api_v1_dashboards__dashboard_id__me_access_get`
70. `POST` `/api/v1/dashboards/{dashboard_id}/refresh` - `refresh_dashboard_api_v1_dashboards__dashboard_id__refresh_post`
71. `POST` `/api/v1/dashboards/{dashboard_id}/widgets` - `create_dashboard_widget_api_v1_dashboards__dashboard_id__widgets_post`
72. `GET` `/api/v1/dashboards/categories` - `get_dashboard_categories_api_v1_dashboards_categories_get`
73. `POST` `/api/v1/dashboards/categories` - `create_dashboard_category_api_v1_dashboards_categories_post`
74. `PUT` `/api/v1/dashboards/categories/{category_id}` - `update_dashboard_category_api_v1_dashboards_categories__category_id__put`
75. `DELETE` `/api/v1/dashboards/categories/{category_id}` - `delete_dashboard_category_api_v1_dashboards_categories__category_id__delete`
76. `PUT` `/api/v1/dashboards/widgets/{widget_id}` - `update_dashboard_widget_api_v1_dashboards_widgets__widget_id__put`
77. `DELETE` `/api/v1/dashboards/widgets/{widget_id}` - `delete_dashboard_widget_api_v1_dashboards_widgets__widget_id__delete`
78. `GET` `/api/v1/data-sources/` - `list_data_sources_api_v1_data_sources__get`
79. `POST` `/api/v1/data-sources/` - `create_data_source_api_v1_data_sources__post`
80. `POST` `/api/v1/data-sources/{data_source_id}/sync` - `sync_data_source_api_v1_data_sources__data_source_id__sync_post`
81. `GET` `/api/v1/data-sources/{data_source_id}/sync-inheritance-stats` - `get_sync_inheritance_stats_api_v1_data_sources__data_source_id__sync_inheritance_stats_get`
82. `GET` `/api/v1/data-sources/{source_id}` - `get_data_source_api_v1_data_sources__source_id__get`
83. `PUT` `/api/v1/data-sources/{source_id}` - `update_data_source_api_v1_data_sources__source_id__put`
84. `DELETE` `/api/v1/data-sources/{source_id}` - `delete_data_source_api_v1_data_sources__source_id__delete`
85. `GET` `/api/v1/data-sources/{source_id}/sync-tables` - `list_sync_tables_api_v1_data_sources__source_id__sync_tables_get`
86. `GET` `/api/v1/data-sources/{source_id}/tables` - `list_tables_api_v1_data_sources__source_id__tables_get`
87. `GET` `/api/v1/data-sources/{source_id}/tables/{schema}/{table}/columns` - `list_columns_api_v1_data_sources__source_id__tables__schema___table__columns_get`
88. `POST` `/api/v1/data-sources/{source_id}/test-connection` - `test_existing_connection_api_v1_data_sources__source_id__test_connection_post`
89. `POST` `/api/v1/data-sources/test-connection` - `test_connection_api_v1_data_sources_test_connection_post`
90. `GET` `/api/v1/datasets/` - `list_datasets_api_v1_datasets__get`
91. `POST` `/api/v1/datasets/` - `create_dataset_api_v1_datasets__post`
92. `GET` `/api/v1/datasets/{dataset_id}` - `get_dataset_api_v1_datasets__dataset_id__get`
93. `PUT` `/api/v1/datasets/{dataset_id}` - `update_dataset_api_v1_datasets__dataset_id__put`
94. `DELETE` `/api/v1/datasets/{dataset_id}` - `delete_dataset_api_v1_datasets__dataset_id__delete`
95. `GET` `/api/v1/datasets/{dataset_id}/columns/{column_name}/unique-values` - `get_unique_column_values_api_v1_datasets__dataset_id__columns__column_name__unique_values_get`
96. `GET` `/api/v1/datasets/{dataset_id}/data` - `get_materialized_dataset_data_api_v1_datasets__dataset_id__data_get`
97. `POST` `/api/v1/datasets/{dataset_id}/data` - `post_materialized_dataset_data_api_v1_datasets__dataset_id__data_post`
98. `GET` `/api/v1/datasets/{dataset_id}/datasetschema` - `get_dataset_schema_api_v1_datasets__dataset_id__datasetschema_get`
99. `POST` `/api/v1/datasets/{dataset_id}/duplicate` - `duplicate_dataset_api_v1_datasets__dataset_id__duplicate_post`
100. `POST` `/api/v1/datasets/{dataset_id}/generate-profile` - `generate_dataset_profile_api_v1_datasets__dataset_id__generate_profile_post`
101. `POST` `/api/v1/datasets/{dataset_id}/materialize` - `materialize_dataset_api_v1_datasets__dataset_id__materialize_post`
102. `GET` `/api/v1/datasets/{dataset_id}/measures` - `list_measures_api_v1_datasets__dataset_id__measures_get`
103. `POST` `/api/v1/datasets/{dataset_id}/measures` - `create_measure_api_v1_datasets__dataset_id__measures_post`
104. `GET` `/api/v1/datasets/{dataset_id}/measures/{measure_id}` - `get_measure_api_v1_datasets__dataset_id__measures__measure_id__get`
105. `PUT` `/api/v1/datasets/{dataset_id}/measures/{measure_id}` - `update_measure_api_v1_datasets__dataset_id__measures__measure_id__put`
106. `DELETE` `/api/v1/datasets/{dataset_id}/measures/{measure_id}` - `delete_measure_api_v1_datasets__dataset_id__measures__measure_id__delete`
107. `POST` `/api/v1/datasets/{dataset_id}/measures/{measure_id}/certify` - `certify_measure_api_v1_datasets__dataset_id__measures__measure_id__certify_post`
108. `GET` `/api/v1/datasets/{dataset_id}/measures/{measure_id}/sql` - `get_measure_sql_api_v1_datasets__dataset_id__measures__measure_id__sql_get`
109. `POST` `/api/v1/datasets/{dataset_id}/measures/validate` - `validate_measure_api_v1_datasets__dataset_id__measures_validate_post`
110. `GET` `/api/v1/datasets/{dataset_id}/output-columns` - `get_dataset_output_columns_normalized_api_v1_datasets__dataset_id__output_columns_get`
111. `GET` `/api/v1/datasets/{dataset_id}/profile` - `get_dataset_profile_api_v1_datasets__dataset_id__profile_get`
112. `POST` `/api/v1/datasets/{dataset_id}/refresh-schema` - `refresh_sql_dataset_schema_api_v1_datasets__dataset_id__refresh_schema_post`
113. `POST` `/api/v1/datasets/{dataset_id}/sync` - `sync_dataset_api_v1_datasets__dataset_id__sync_post`
114. `GET` `/api/v1/datasets/{dataset_id}/sync/status` - `get_sync_status_api_v1_datasets__dataset_id__sync_status_get`
115. `GET` `/api/v1/datasets/{dataset_id}/versions` - `list_dataset_versions_api_v1_datasets__dataset_id__versions_get`
116. `GET` `/api/v1/datasets/{dataset_id}/versions/{version_id}` - `get_dataset_version_api_v1_datasets__dataset_id__versions__version_id__get`
117. `GET` `/api/v1/datasets/available-as-source` - `get_available_datasets_for_source_api_v1_datasets_available_as_source_get`
118. `PUT` `/api/v1/datasets/custom-sql/{dataset_id}` - `update_custom_sql_dataset_api_v1_datasets_custom_sql__dataset_id__put`
119. `POST` `/api/v1/datasets/custom-sql/create` - `create_custom_sql_dataset_api_v1_datasets_custom_sql_create_post`
120. `POST` `/api/v1/datasets/custom-sql/preview` - `preview_sql_query_api_v1_datasets_custom_sql_preview_post`
121. `GET` `/api/v1/datasets/custom-sql/tables` - `get_available_tables_api_v1_datasets_custom_sql_tables_get`
122. `POST` `/api/v1/datasets/custom-sql/tables/batch` - `get_tables_by_ids_api_v1_datasets_custom_sql_tables_batch_post`
123. `POST` `/api/v1/datasets/custom-sql/validate` - `validate_sql_query_api_v1_datasets_custom_sql_validate_post`
124. `POST` `/api/v1/datasets/preview` - `preview_dataset_api_v1_datasets_preview_post`
125. `POST` `/api/v1/datasets/validate-dependencies` - `validate_dataset_dependencies_api_v1_datasets_validate_dependencies_post`
126. `POST` `/api/v1/discovery/run/{data_source_id}/sync` - `discover_metadata_sync_api_v1_discovery_run__data_source_id__sync_post`
127. `GET` `/api/v1/entity-groups/` - `list_entity_groups_api_v1_entity_groups__get`
128. `POST` `/api/v1/entity-groups/` - `create_entity_group_api_v1_entity_groups__post`
129. `GET` `/api/v1/entity-groups/{group_id}` - `get_entity_group_api_v1_entity_groups__group_id__get`
130. `PUT` `/api/v1/entity-groups/{group_id}` - `update_entity_group_api_v1_entity_groups__group_id__put`
131. `DELETE` `/api/v1/entity-groups/{group_id}` - `delete_entity_group_api_v1_entity_groups__group_id__delete`
132. `GET` `/api/v1/entity-groups/{group_id}/members` - `get_group_members_api_v1_entity_groups__group_id__members_get`
133. `POST` `/api/v1/entity-groups/{group_id}/members` - `add_group_members_api_v1_entity_groups__group_id__members_post`
134. `DELETE` `/api/v1/entity-groups/{group_id}/members/{entity_id}` - `remove_group_member_api_v1_entity_groups__group_id__members__entity_id__delete`
135. `POST` `/api/v1/entity-groups/{group_id}/members/remove` - `remove_group_members_bulk_api_v1_entity_groups__group_id__members_remove_post`
136. `GET` `/api/v1/entity-groups/entity/{entity_type}/{entity_id}/groups` - `get_entity_groups_api_v1_entity_groups_entity__entity_type___entity_id__groups_get`
137. `PUT` `/api/v1/entity-groups/entity/{entity_type}/{entity_id}/groups` - `update_entity_groups_api_v1_entity_groups_entity__entity_type___entity_id__groups_put`
138. `DELETE` `/api/v1/exports/{job_id}` - `cancel_export_api_v1_exports__job_id__delete`
139. `GET` `/api/v1/exports/{job_id}/download` - `download_export_api_v1_exports__job_id__download_get`
140. `GET` `/api/v1/exports/{job_id}/status` - `get_export_status_api_v1_exports__job_id__status_get`
141. `GET` `/api/v1/exports/history` - `get_export_history_api_v1_exports_history_get`
142. `GET` `/api/v1/exports/rate-limit` - `get_rate_limit_status_api_v1_exports_rate_limit_get`
143. `GET` `/api/v1/feature-flags/` - `get_feature_flags_api_v1_feature_flags__get`
144. `POST` `/api/v1/feature-flags/` - `create_feature_flag_api_v1_feature_flags__post`
145. `GET` `/api/v1/feature-flags/{flag_name}` - `get_feature_flag_api_v1_feature_flags__flag_name__get`
146. `PUT` `/api/v1/feature-flags/{flag_name}` - `update_feature_flag_api_v1_feature_flags__flag_name__put`
147. `DELETE` `/api/v1/feature-flags/{flag_name}` - `delete_feature_flag_api_v1_feature_flags__flag_name__delete`
148. `GET` `/api/v1/feature-flags/check/{flag_name}` - `check_feature_flag_api_v1_feature_flags_check__flag_name__get`
149. `GET` `/api/v1/feature-flags/user-flags` - `get_user_feature_flags_api_v1_feature_flags_user_flags_get`
150. `DELETE` `/api/v1/files/{filename}` - `delete_file_api_v1_files__filename__delete`
151. `GET` `/api/v1/files/download/{filename}` - `download_file_api_v1_files_download__filename__get`
152. `GET` `/api/v1/files/list` - `list_files_api_v1_files_list_get`
153. `POST` `/api/v1/files/upload` - `upload_file_api_v1_files_upload_post`
154. `GET` `/api/v1/groups` - `list_groups_api_v1_groups_get`
155. `POST` `/api/v1/groups` - `create_group_api_v1_groups_post`
156. `GET` `/api/v1/groups/{group_id}` - `get_group_api_v1_groups__group_id__get`
157. `PUT` `/api/v1/groups/{group_id}` - `update_group_api_v1_groups__group_id__put`
158. `DELETE` `/api/v1/groups/{group_id}` - `delete_group_api_v1_groups__group_id__delete`
159. `GET` `/api/v1/groups/{group_id}/members` - `get_group_members_api_v1_groups__group_id__members_get`
160. `POST` `/api/v1/groups/{group_id}/members` - `add_group_members_api_v1_groups__group_id__members_post`
161. `DELETE` `/api/v1/groups/{group_id}/members/{user_id}` - `remove_group_member_api_v1_groups__group_id__members__user_id__delete`
162. `GET` `/api/v1/groups/me/groups` - `get_my_groups_api_v1_groups_me_groups_get`
163. `GET` `/api/v1/groups/user/{user_id}/groups` - `get_user_groups_api_v1_groups_user__user_id__groups_get`
164. `GET` `/api/v1/health/` - `health_check_api_v1_health__get`
165. `GET` `/api/v1/health/detailed` - `detailed_health_check_api_v1_health_detailed_get`
166. `GET` `/api/v1/health/live` - `liveness_check_api_v1_health_live_get`
167. `GET` `/api/v1/health/ready` - `readiness_check_api_v1_health_ready_get`
168. `GET` `/api/v1/parameters/` - `list_parameters_api_v1_parameters__get`
169. `POST` `/api/v1/parameters/` - `create_parameter_api_v1_parameters__post`
170. `GET` `/api/v1/parameters/{parameter_id}` - `get_parameter_api_v1_parameters__parameter_id__get`
171. `PUT` `/api/v1/parameters/{parameter_id}` - `update_parameter_api_v1_parameters__parameter_id__put`
172. `DELETE` `/api/v1/parameters/{parameter_id}` - `delete_parameter_api_v1_parameters__parameter_id__delete`
173. `GET` `/api/v1/parameters/{parameter_id}/usages` - `get_parameter_usages_api_v1_parameters__parameter_id__usages_get`
174. `POST` `/api/v1/parameters/{parameter_id}/validate` - `validate_parameter_value_api_v1_parameters__parameter_id__validate_post`
175. `GET` `/api/v1/parameters/datasource/{datasource_id}` - `list_datasource_parameters_api_v1_parameters_datasource__datasource_id__get`
176. `GET` `/api/v1/parameters/global` - `list_global_parameters_api_v1_parameters_global_get`
177. `POST` `/api/v1/parameters/replace` - `replace_parameters_api_v1_parameters_replace_post`
178. `POST` `/api/v1/parameters/runtime-value` - `set_runtime_value_api_v1_parameters_runtime_value_post`
179. `DELETE` `/api/v1/parameters/runtime-value/{runtime_value_id}` - `delete_runtime_value_api_v1_parameters_runtime_value__runtime_value_id__delete`
180. `GET` `/api/v1/parameters/runtime-values` - `get_runtime_values_api_v1_parameters_runtime_values_get`
181. `POST` `/api/v1/query/query/join-path` - `find_join_path_api_v1_query_query_join_path_post`
182. `GET` `/api/v1/query/tables/{table_id}/related-tables` - `get_related_tables_api_v1_query_tables__table_id__related_tables_get`
183. `GET` `/api/v1/questions-v2/` - `list_questions_v2_api_v1_questions_v2__get`
184. `POST` `/api/v1/questions-v2/` - `create_question_v2_api_v1_questions_v2__post`
185. `GET` `/api/v1/questions-v2/{question_id}` - `get_question_v2_api_v1_questions_v2__question_id__get`
186. `PUT` `/api/v1/questions-v2/{question_id}` - `update_question_v2_api_v1_questions_v2__question_id__put`
187. `DELETE` `/api/v1/questions-v2/{question_id}` - `delete_question_v2_api_v1_questions_v2__question_id__delete`
188. `GET` `/api/v1/questions-v2/{question_id}/data` - `get_question_data_v2_api_v1_questions_v2__question_id__data_get`
189. `POST` `/api/v1/questions-v2/{question_id}/duplicate` - `duplicate_question_v2_api_v1_questions_v2__question_id__duplicate_post`
190. `POST` `/api/v1/questions-v2/{question_id}/materialize` - `materialize_question_api_v1_questions_v2__question_id__materialize_post`
191. `GET` `/api/v1/questions-v2/categories` - `get_categories_v2_api_v1_questions_v2_categories_get`
192. `POST` `/api/v1/questions-v2/categories` - `create_category_v2_api_v1_questions_v2_categories_post`
193. `PUT` `/api/v1/questions-v2/categories/{category_id}` - `update_category_v2_api_v1_questions_v2_categories__category_id__put`
194. `DELETE` `/api/v1/questions-v2/categories/{category_id}` - `delete_category_v2_api_v1_questions_v2_categories__category_id__delete`
195. `GET` `/api/v1/questions-v2/chart-types` - `get_chart_types_v2_api_v1_questions_v2_chart_types_get`
196. `POST` `/api/v1/questions-v2/convert/v1-to-v2/{question_id}` - `convert_question_to_v2_api_v1_questions_v2_convert_v1_to_v2__question_id__post`
197. `GET` `/api/v1/questions-v2/health` - `health_check_api_v1_questions_v2_health_get`
198. `POST` `/api/v1/questions-v2/preview` - `preview_question_v2_api_v1_questions_v2_preview_post`
199. `POST` `/api/v1/questions-v2/validate-measures` - `validate_derived_measures_api_v1_questions_v2_validate_measures_post`
200. `GET` `/api/v1/questions/` - `get_questions_api_v1_questions__get`
201. `GET` `/api/v1/questions/{question_id}` - `get_question_api_v1_questions__question_id__get`
202. `DELETE` `/api/v1/questions/{question_id}` - `delete_question_api_v1_questions__question_id__delete`
203. `POST` `/api/v1/questions/{question_id}/data` - `get_question_data_api_v1_questions__question_id__data_post`
204. `GET` `/api/v1/questions/{question_id}/drill-down` - `get_drill_down_data_api_v1_questions__question_id__drill_down_get`
205. `POST` `/api/v1/questions/{question_id}/duplicate` - `duplicate_question_api_v1_questions__question_id__duplicate_post`
206. `POST` `/api/v1/questions/{question_id}/tooltip-data` - `get_tooltip_data_api_v1_questions__question_id__tooltip_data_post`
207. `GET` `/api/v1/questions/categories` - `get_question_categories_api_v1_questions_categories_get`
208. `POST` `/api/v1/questions/categories` - `create_question_category_api_v1_questions_categories_post`
209. `PUT` `/api/v1/questions/categories/{category_id}` - `update_question_category_api_v1_questions_categories__category_id__put`
210. `DELETE` `/api/v1/questions/categories/{category_id}` - `delete_question_category_api_v1_questions_categories__category_id__delete`
211. `GET` `/api/v1/questions/chart-types` - `get_chart_types_api_v1_questions_chart_types_get`
212. `GET` `/api/v1/relationships` - `list_relationships_api_v1_relationships_get`
213. `POST` `/api/v1/relationships` - `create_relationship_api_v1_relationships_post`
214. `GET` `/api/v1/relationships/{relationship_id}` - `get_relationship_api_v1_relationships__relationship_id__get`
215. `PUT` `/api/v1/relationships/{relationship_id}` - `update_relationship_api_v1_relationships__relationship_id__put`
216. `DELETE` `/api/v1/relationships/{relationship_id}` - `delete_relationship_api_v1_relationships__relationship_id__delete`
217. `GET` `/api/v1/relationships/{relationship_id}/column-mappings` - `list_column_mappings_api_v1_relationships__relationship_id__column_mappings_get`
218. `GET` `/api/v1/relationships/tables/{table_id}/relationships` - `get_table_relationships_api_v1_relationships_tables__table_id__relationships_get`
219. `GET` `/api/v1/reports/` - `list_reports_api_v1_reports__get`
220. `POST` `/api/v1/reports/` - `create_report_api_v1_reports__post`
221. `GET` `/api/v1/reports/{report_id}` - `get_report_api_v1_reports__report_id__get`
222. `PUT` `/api/v1/reports/{report_id}` - `update_report_api_v1_reports__report_id__put`
223. `DELETE` `/api/v1/reports/{report_id}` - `delete_report_api_v1_reports__report_id__delete`
224. `GET` `/api/v1/reports/{report_id}/access` - `list_report_access_api_v1_reports__report_id__access_get`
225. `POST` `/api/v1/reports/{report_id}/access/{user_id}` - `grant_access_api_v1_reports__report_id__access__user_id__post`
226. `DELETE` `/api/v1/reports/{report_id}/access/{user_id}` - `revoke_access_api_v1_reports__report_id__access__user_id__delete`
227. `GET` `/api/v1/reports/{report_id}/columns/{column_name}/unique-values` - `get_unique_column_values_api_v1_reports__report_id__columns__column_name__unique_values_get`
228. `GET` `/api/v1/reports/{report_id}/drill-level` - `get_drill_level_api_v1_reports__report_id__drill_level_get`
229. `POST` `/api/v1/reports/{report_id}/drill-level` - `post_drill_level_api_v1_reports__report_id__drill_level_post`
230. `POST` `/api/v1/reports/{report_id}/duplicate` - `duplicate_report_api_v1_reports__report_id__duplicate_post`
231. `GET` `/api/v1/reports/{report_id}/effective-measures` - `get_effective_measures_api_v1_reports__report_id__effective_measures_get`
232. `POST` `/api/v1/reports/{report_id}/export` - `initiate_export_api_v1_reports__report_id__export_post`
233. `POST` `/api/v1/reports/{report_id}/export/preview` - `preview_export_api_v1_reports__report_id__export_preview_post`
234. `GET` `/api/v1/reports/{report_id}/grand-totals` - `get_report_grand_totals_api_v1_reports__report_id__grand_totals_get`
235. `GET` `/api/v1/reports/{report_id}/materialization-status/{task_id}` - `get_materialization_status_api_v1_reports__report_id__materialization_status__task_id__get`
236. `POST` `/api/v1/reports/{report_id}/materialize` - `materialize_report_api_v1_reports__report_id__materialize_post`
237. `GET` `/api/v1/reports/{report_id}/measures` - `list_report_measures_api_v1_reports__report_id__measures_get`
238. `POST` `/api/v1/reports/{report_id}/measures` - `add_report_measure_api_v1_reports__report_id__measures_post`
239. `PUT` `/api/v1/reports/{report_id}/measures/{measure_id}` - `update_report_measure_api_v1_reports__report_id__measures__measure_id__put`
240. `DELETE` `/api/v1/reports/{report_id}/measures/{measure_id}` - `delete_report_measure_api_v1_reports__report_id__measures__measure_id__delete`
241. `POST` `/api/v1/reports/{report_id}/measures/validate` - `validate_runtime_measure_api_v1_reports__report_id__measures_validate_post`
242. `POST` `/api/v1/reports/{report_id}/query` - `query_report_api_v1_reports__report_id__query_post`
243. `GET` `/api/v1/reports/{report_id}/saved-filters` - `list_saved_filters_api_v1_reports__report_id__saved_filters_get`
244. `POST` `/api/v1/reports/{report_id}/saved-filters` - `create_saved_filter_api_v1_reports__report_id__saved_filters_post`
245. `GET` `/api/v1/reports/{report_id}/saved-filters/{filter_id}` - `get_saved_filter_api_v1_reports__report_id__saved_filters__filter_id__get`
246. `PUT` `/api/v1/reports/{report_id}/saved-filters/{filter_id}` - `update_saved_filter_api_v1_reports__report_id__saved_filters__filter_id__put`
247. `DELETE` `/api/v1/reports/{report_id}/saved-filters/{filter_id}` - `delete_saved_filter_api_v1_reports__report_id__saved_filters__filter_id__delete`
248. `GET` `/api/v1/reports/{report_id}/saved-filters/default` - `get_default_saved_filter_api_v1_reports__report_id__saved_filters_default_get`
249. `GET` `/api/v1/reports/{report_id}/schedule` - `get_schedule_api_v1_reports__report_id__schedule_get`
250. `POST` `/api/v1/reports/{report_id}/schedule` - `create_schedule_api_v1_reports__report_id__schedule_post`
251. `GET` `/api/v1/reports/{report_id}/user-measures` - `get_user_measures_for_report_api_v1_reports__report_id__user_measures_get`
252. `POST` `/api/v1/reports/{report_id}/user-measures` - `add_user_measure_for_report_api_v1_reports__report_id__user_measures_post`
253. `PUT` `/api/v1/reports/{report_id}/user-measures` - `save_user_measures_for_report_api_v1_reports__report_id__user_measures_put`
254. `PATCH` `/api/v1/reports/{report_id}/user-measures/{measure_id}` - `update_user_measure_for_report_api_v1_reports__report_id__user_measures__measure_id__patch`
255. `DELETE` `/api/v1/reports/{report_id}/user-measures/{measure_id}` - `delete_user_measure_for_report_api_v1_reports__report_id__user_measures__measure_id__delete`
256. `GET` `/api/v1/reports/{report_id}/virtual-reports` - `list_virtual_reports_for_parent_api_v1_reports__report_id__virtual_reports_get`
257. `POST` `/api/v1/reports/{report_id}/virtual-reports` - `create_virtual_report_api_v1_reports__report_id__virtual_reports_post`
258. `GET` `/api/v1/reports/categories` - `list_categories_api_v1_reports_categories_get`
259. `POST` `/api/v1/reports/categories` - `create_category_api_v1_reports_categories_post`
260. `POST` `/api/v1/reports/preview` - `preview_report_api_v1_reports_preview_post`
261. `PUT` `/api/v1/reports/schedule/{schedule_id}` - `update_schedule_api_v1_reports_schedule__schedule_id__put`
262. `DELETE` `/api/v1/reports/schedule/{schedule_id}` - `delete_schedule_api_v1_reports_schedule__schedule_id__delete`
263. `POST` `/api/v1/sharing/{content_type}/{content_id}/share` - `share_content_api_v1_sharing__content_type___content_id__share_post`
264. `DELETE` `/api/v1/sharing/{content_type}/{content_id}/share/{share_id}` - `remove_share_api_v1_sharing__content_type___content_id__share__share_id__delete`
265. `GET` `/api/v1/sharing/{content_type}/{content_id}/shares` - `get_content_shares_api_v1_sharing__content_type___content_id__shares_get`
266. `DELETE` `/api/v1/sharing/{content_type}/{content_id}/shares` - `remove_all_shares_api_v1_sharing__content_type___content_id__shares_delete`
267. `GET` `/api/v1/subscriptions` - `list_subscriptions_api_v1_subscriptions_get`
268. `POST` `/api/v1/subscriptions` - `create_subscription_api_v1_subscriptions_post`
269. `GET` `/api/v1/subscriptions/{subscription_id}` - `get_subscription_api_v1_subscriptions__subscription_id__get`
270. `PUT` `/api/v1/subscriptions/{subscription_id}` - `update_subscription_api_v1_subscriptions__subscription_id__put`
271. `DELETE` `/api/v1/subscriptions/{subscription_id}` - `delete_subscription_api_v1_subscriptions__subscription_id__delete`
272. `GET` `/api/v1/subscriptions/{subscription_id}/deliveries` - `get_delivery_history_api_v1_subscriptions__subscription_id__deliveries_get`
273. `POST` `/api/v1/subscriptions/{subscription_id}/pause` - `pause_subscription_api_v1_subscriptions__subscription_id__pause_post`
274. `POST` `/api/v1/subscriptions/{subscription_id}/resume` - `resume_subscription_api_v1_subscriptions__subscription_id__resume_post`
275. `POST` `/api/v1/subscriptions/{subscription_id}/send-now` - `send_now_api_v1_subscriptions__subscription_id__send_now_post`
276. `DELETE` `/api/v1/subscriptions/admin/{subscription_id}` - `admin_delete_subscription_api_v1_subscriptions_admin__subscription_id__delete`
277. `POST` `/api/v1/subscriptions/admin/{subscription_id}/pause` - `admin_pause_subscription_api_v1_subscriptions_admin__subscription_id__pause_post`
278. `POST` `/api/v1/subscriptions/admin/{subscription_id}/resume` - `admin_resume_subscription_api_v1_subscriptions_admin__subscription_id__resume_post`
279. `GET` `/api/v1/subscriptions/admin/all` - `admin_list_all_subscriptions_api_v1_subscriptions_admin_all_get`
280. `GET` `/api/v1/subscriptions/admin/analytics` - `get_subscription_analytics_api_v1_subscriptions_admin_analytics_get`
281. `GET` `/api/v1/subscriptions/content/{content_type}/{content_id}` - `get_content_subscriptions_api_v1_subscriptions_content__content_type___content_id__get`
282. `GET` `/api/v1/subscriptions/deliveries/{delivery_id}/download` - `download_delivery_file_api_v1_subscriptions_deliveries__delivery_id__download_get`
283. `POST` `/api/v1/subscriptions/external-recipients/{recipient_id}/approve` - `approve_external_recipient_api_v1_subscriptions_external_recipients__recipient_id__approve_post`
284. `GET` `/api/v1/subscriptions/external-recipients/pending` - `list_pending_external_recipients_api_v1_subscriptions_external_recipients_pending_get`
285. `GET` `/api/v1/subscriptions/recipients/groups` - `list_recipient_groups_api_v1_subscriptions_recipients_groups_get`
286. `GET` `/api/v1/subscriptions/recipients/search` - `search_recipients_api_v1_subscriptions_recipients_search_get`
287. `GET` `/api/v1/subscriptions/recipients/users` - `list_recipient_users_api_v1_subscriptions_recipients_users_get`
288. `GET` `/api/v1/sync-logs/` - `list_sync_logs_api_v1_sync_logs__get`
289. `GET` `/api/v1/sync-logs/{sync_log_id}` - `get_sync_log_api_v1_sync_logs__sync_log_id__get`
290. `GET` `/api/v1/sync-logs/stats/summary` - `get_sync_stats_api_v1_sync_logs_stats_summary_get`
291. `GET` `/api/v1/sync-logs/tables/{table_id}/latest` - `get_latest_sync_log_api_v1_sync_logs_tables__table_id__latest_get`
292. `POST` `/api/v1/sync/all` - `sync_all_data_sources_api_v1_sync_all_post`
293. `GET` `/api/v1/sync/status` - `get_sync_status_api_v1_sync_status_get`
294. `GET` `/api/v1/tables/` - `list_tables_api_v1_tables__get`
295. `POST` `/api/v1/tables/` - `create_table_api_v1_tables__post`
296. `GET` `/api/v1/tables/{table_id}` - `get_table_api_v1_tables__table_id__get`
297. `PUT` `/api/v1/tables/{table_id}` - `update_table_api_v1_tables__table_id__put`
298. `DELETE` `/api/v1/tables/{table_id}` - `delete_table_api_v1_tables__table_id__delete`
299. `GET` `/api/v1/tables/{table_id}/data-preview` - `get_table_data_preview_api_v1_tables__table_id__data_preview_get`
300. `POST` `/api/v1/tables/{table_id}/disable-sync` - `disable_table_sync_api_v1_tables__table_id__disable_sync_post`
301. `POST` `/api/v1/tables/{table_id}/enable-sync` - `enable_table_sync_api_v1_tables__table_id__enable_sync_post`
302. `POST` `/api/v1/tables/{table_id}/sync` - `sync_table_api_v1_tables__table_id__sync_post`
303. `GET` `/api/v1/tables/{table_id}/sync-config` - `get_table_sync_config_api_v1_tables__table_id__sync_config_get`
304. `PUT` `/api/v1/tables/{table_id}/sync-config` - `update_table_sync_config_api_v1_tables__table_id__sync_config_put`
305. `DELETE` `/api/v1/tables/{table_id}/sync-config` - `delete_table_sync_config_api_v1_tables__table_id__sync_config_delete`
306. `POST` `/api/v1/tables/{table_id}/sync-config/auto-detect` - `auto_detect_table_sync_config_api_v1_tables__table_id__sync_config_auto_detect_post`
307. `GET` `/api/v1/tables/{table_id}/sync-config/columns` - `get_table_sync_config_columns_api_v1_tables__table_id__sync_config_columns_get`
308. `POST` `/api/v1/tables/bulk-sync-update` - `bulk_update_table_sync_api_v1_tables_bulk_sync_update_post`
309. `GET` `/api/v1/tasks/{task_id}/status` - `get_task_status_api_v1_tasks__task_id__status_get`
310. `GET` `/api/v1/user/preferences/reports/{report_id}` - `get_report_preferences_api_v1_user_preferences_reports__report_id__get`
311. `POST` `/api/v1/user/preferences/reports/{report_id}` - `save_report_preferences_api_v1_user_preferences_reports__report_id__post`
312. `DELETE` `/api/v1/user/preferences/reports/{report_id}` - `delete_report_preferences_api_v1_user_preferences_reports__report_id__delete`
313. `GET` `/api/v1/user/preferences/virtual-reports/{virtual_report_id}` - `get_virtual_report_preferences_api_v1_user_preferences_virtual_reports__virtual_report_id__get`
314. `POST` `/api/v1/user/preferences/virtual-reports/{virtual_report_id}` - `save_virtual_report_preferences_api_v1_user_preferences_virtual_reports__virtual_report_id__post`
315. `DELETE` `/api/v1/user/preferences/virtual-reports/{virtual_report_id}` - `delete_virtual_report_preferences_api_v1_user_preferences_virtual_reports__virtual_report_id__delete`
316. `GET` `/api/v1/user/views/reports/{report_id}` - `list_report_views_api_v1_user_views_reports__report_id__get`
317. `POST` `/api/v1/user/views/reports/{report_id}` - `create_report_view_api_v1_user_views_reports__report_id__post`
318. `GET` `/api/v1/user/views/reports/{report_id}/{view_id}` - `get_report_view_api_v1_user_views_reports__report_id___view_id__get`
319. `PUT` `/api/v1/user/views/reports/{report_id}/{view_id}` - `update_report_view_api_v1_user_views_reports__report_id___view_id__put`
320. `DELETE` `/api/v1/user/views/reports/{report_id}/{view_id}` - `delete_report_view_api_v1_user_views_reports__report_id___view_id__delete`
321. `POST` `/api/v1/user/views/reports/{report_id}/{view_id}/copy` - `copy_report_view_api_v1_user_views_reports__report_id___view_id__copy_post`
322. `POST` `/api/v1/user/views/reports/{report_id}/{view_id}/set-default` - `set_default_report_view_api_v1_user_views_reports__report_id___view_id__set_default_post`
323. `POST` `/api/v1/user/views/reports/{report_id}/clear-default` - `clear_default_report_view_api_v1_user_views_reports__report_id__clear_default_post`
324. `GET` `/api/v1/user/views/virtual-reports/{virtual_report_id}` - `list_virtual_report_views_api_v1_user_views_virtual_reports__virtual_report_id__get`
325. `POST` `/api/v1/user/views/virtual-reports/{virtual_report_id}` - `create_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id__post`
326. `GET` `/api/v1/user/views/virtual-reports/{virtual_report_id}/{view_id}` - `get_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id___view_id__get`
327. `PUT` `/api/v1/user/views/virtual-reports/{virtual_report_id}/{view_id}` - `update_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id___view_id__put`
328. `DELETE` `/api/v1/user/views/virtual-reports/{virtual_report_id}/{view_id}` - `delete_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id___view_id__delete`
329. `POST` `/api/v1/user/views/virtual-reports/{virtual_report_id}/{view_id}/copy` - `copy_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id___view_id__copy_post`
330. `POST` `/api/v1/user/views/virtual-reports/{virtual_report_id}/{view_id}/set-default` - `set_default_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id___view_id__set_default_post`
331. `POST` `/api/v1/user/views/virtual-reports/{virtual_report_id}/clear-default` - `clear_default_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id__clear_default_post`
332. `GET` `/api/v1/users` - `list_users_api_v1_users_get`
333. `POST` `/api/v1/users` - `create_user_api_v1_users_post`
334. `GET` `/api/v1/users/{user_id}` - `get_user_api_v1_users__user_id__get`
335. `PUT` `/api/v1/users/{user_id}` - `update_user_api_v1_users__user_id__put`
336. `DELETE` `/api/v1/users/{user_id}` - `delete_user_api_v1_users__user_id__delete`
337. `POST` `/api/v1/users/{user_id}/reset-password` - `reset_user_password_api_v1_users__user_id__reset_password_post`
338. `GET` `/api/v1/users/me` - `get_current_user_profile_api_v1_users_me_get`
339. `PUT` `/api/v1/users/me` - `update_current_user_profile_api_v1_users_me_put`
340. `POST` `/api/v1/users/me/change-password` - `change_password_api_v1_users_me_change_password_post`
341. `GET` `/api/v1/users/search` - `search_users_api_v1_users_search_get`
342. `GET` `/api/v1/virtual-reports/{id}` - `get_virtual_report_api_v1_virtual_reports__id__get`
343. `PUT` `/api/v1/virtual-reports/{id}` - `update_virtual_report_api_v1_virtual_reports__id__put`
344. `DELETE` `/api/v1/virtual-reports/{id}` - `delete_virtual_report_api_v1_virtual_reports__id__delete`
345. `GET` `/api/v1/virtual-reports/{id}/columns/{column_name}/unique-values` - `get_virtual_report_unique_values_api_v1_virtual_reports__id__columns__column_name__unique_values_get`
346. `GET` `/api/v1/virtual-reports/{id}/drill-level` - `get_virtual_report_drill_level_api_v1_virtual_reports__id__drill_level_get`
347. `GET` `/api/v1/virtual-reports/{id}/grand-totals` - `get_virtual_report_grand_totals_api_v1_virtual_reports__id__grand_totals_get`
348. `POST` `/api/v1/virtual-reports/{id}/query` - `query_virtual_report_api_v1_virtual_reports__id__query_post`
349. `GET` `/api/v1/virtual-reports/{virtual_report_id}/measures` - `list_vr_measures_api_v1_virtual_reports__virtual_report_id__measures_get`
350. `POST` `/api/v1/virtual-reports/{virtual_report_id}/measures` - `add_vr_measure_api_v1_virtual_reports__virtual_report_id__measures_post`
351. `DELETE` `/api/v1/virtual-reports/{virtual_report_id}/measures/{measure_id}` - `delete_vr_measure_api_v1_virtual_reports__virtual_report_id__measures__measure_id__delete`
352. `PATCH` `/api/v1/virtual-reports/{virtual_report_id}/measures/inheritance` - `update_vr_inheritance_config_api_v1_virtual_reports__virtual_report_id__measures_inheritance_patch`
353. `GET` `/api/v1/virtual-reports/{virtual_report_id}/saved-filters` - `list_virtual_report_saved_filters_api_v1_virtual_reports__virtual_report_id__saved_filters_get`
354. `POST` `/api/v1/virtual-reports/{virtual_report_id}/saved-filters` - `create_virtual_report_saved_filter_api_v1_virtual_reports__virtual_report_id__saved_filters_post`
355. `GET` `/api/v1/virtual-reports/{virtual_report_id}/saved-filters/{filter_id}` - `get_virtual_report_saved_filter_api_v1_virtual_reports__virtual_report_id__saved_filters__filter_id__get`
356. `PUT` `/api/v1/virtual-reports/{virtual_report_id}/saved-filters/{filter_id}` - `update_virtual_report_saved_filter_api_v1_virtual_reports__virtual_report_id__saved_filters__filter_id__put`
357. `DELETE` `/api/v1/virtual-reports/{virtual_report_id}/saved-filters/{filter_id}` - `delete_virtual_report_saved_filter_api_v1_virtual_reports__virtual_report_id__saved_filters__filter_id__delete`
358. `GET` `/api/v1/virtual-reports/{virtual_report_id}/saved-filters/default` - `get_virtual_report_default_filter_api_v1_virtual_reports__virtual_report_id__saved_filters_default_get`
359. `GET` `/api/v1/virtual-reports/{virtual_report_id}/user-measures` - `get_user_measures_for_vr_api_v1_virtual_reports__virtual_report_id__user_measures_get`
360. `PUT` `/api/v1/virtual-reports/{virtual_report_id}/user-measures` - `save_user_measures_for_vr_api_v1_virtual_reports__virtual_report_id__user_measures_put`

## Full API Details

### POST /api/v1/admin/migrate-preferences

- OperationId: `migrate_preferences_to_views_api_v1_admin_migrate_preferences_post`
- Tags: `saved-views`, `Saved Views Admin`
- Summary: Migrate Preferences to Views (Admin)
- Description: Migrate user_report_preferences to user_report_views. Admin only.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dry_run` | `query` | No | boolean | If true, preview changes without committing |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/MigrationStatsResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/admin/reset-sync-state

- OperationId: `reset_sync_state_api_v1_admin_reset_sync_state_post`
- Tags: `sync`, `sync-admin`
- Summary: Reset Sync State
- Description: Reset sync scheduling state for a fresh start. This endpoint allows admins to: - Reset table sync_status to 'idle' for stuck tables - Cancel in-progress sync logs Use this when sync scheduling is in a bad state (e.g., infinite sync loops).

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/SyncResetRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SyncResetResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/admin/sync-status

- OperationId: `get_sync_status_summary_api_v1_admin_sync_status_get`
- Tags: `sync`, `sync-admin`
- Summary: Get Sync Status Summary
- Description: Get summary of current sync status across all tables.

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SyncStatusSummary` | Successful Response |

---

### POST /api/v1/ai-assistant/attach-context

- OperationId: `attach_context_api_v1_ai_assistant_attach_context_post`
- Tags: `ai-assistant`, `AI Assistant`
- Summary: Attach context to conversation
- Description: Attach a dataset, question, report, or dashboard to the conversation.     The AI will use this context to provide data-specific insights.          **Supported Context Types:**     - **dataset**: Analyze raw dataset data     - **question**: Analyze chart/visualization data     - **report**: Analyze report data     - **dashboard**: Analyze dashboard widgets          **Authentication:** Required (HTTP Basic)          **Permissions:** User must have access to the context item

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/AttachContextRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AttachContextResponse` | Context attached successfully |
| `400` | `N/A` | N/A | Invalid context type or ID |
| `401` | `N/A` | N/A | Authentication required |
| `403` | `N/A` | N/A | No permission to access this context |
| `404` | `N/A` | N/A | Context not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/ai-assistant/chat

- OperationId: `chat_api_v1_ai_assistant_chat_post`
- Tags: `ai-assistant`, `AI Assistant`
- Summary: Chat with AI Assistant
- Description: Send a message to the AI Assistant and receive an intelligent response.          **Features:**     - Automatic model selection based on question complexity     - Context-aware responses with data analysis     - Suggested follow-up questions     - Full audit logging for compliance          **Models:**     - **Phi**: Fast responses (5-10s) for simple questions     - **Mistral**: Balanced (20-30s) for medium complexity     - **Llama3**: Deep analysis (45-60s) for strategic questions          **Authentication:** Required (HTTP Basic)          **Rate Limits:** 100 requests per hour per user

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ChatRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ChatResponse` | Successful response from AI |
| `400` | `N/A` | N/A | Invalid request parameters |
| `401` | `N/A` | N/A | Authentication required |
| `403` | `N/A` | N/A | Insufficient permissions |
| `408` | `N/A` | N/A | Request timeout |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `429` | `N/A` | N/A | Rate limit exceeded |
| `500` | `N/A` | N/A | Internal server error |
| `503` | `N/A` | N/A | AI service unavailable |

---

### GET /api/v1/ai-assistant/contexts

- OperationId: `get_available_contexts_api_v1_ai_assistant_contexts_get`
- Tags: `ai-assistant`, `AI Assistant`
- Summary: Get available contexts
- Description: Retrieve a list of datasets, questions, reports, and dashboards that can be     attached to conversations.          **Context Types:**     - **dataset**: All active datasets user has access to     - **question**: All active questions/charts user has access to     - **report**: All active reports user has access to     - **dashboard**: All dashboards user has access to          **Authentication:** Required (HTTP Basic)          **Filtering:** Results are automatically filtered based on user permissions

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `context_type` | `query` | No | anyOf(string | null) | Filter by context type (dataset, question, report, dashboard) |
| `limit` | `query` | No | integer | Maximum number of results (1-100) |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AvailableContextsResponse` | List of available contexts |
| `401` | `N/A` | N/A | Authentication required |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/ai-assistant/conversation/{conversation_id}

- OperationId: `get_conversation_with_messages_api_v1_ai_assistant_conversation__conversation_id__get`
- Tags: `ai-assistant`, `AI Assistant`
- Summary: Get conversation with messages
- Description: Retrieve a specific conversation with all its messages.          **Features:**     - Returns conversation metadata and all messages     - Messages are ordered chronologically     - Includes context information     - User must own the conversation          **Authentication:** Required (HTTP Basic)          **Use Case:** Load conversation details for display or continuation

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `conversation_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Conversation with messages |
| `401` | `N/A` | N/A | Authentication required |
| `404` | `N/A` | N/A | Conversation not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### DELETE /api/v1/ai-assistant/conversation/{conversation_id}

- OperationId: `delete_conversation_api_v1_ai_assistant_conversation__conversation_id__delete`
- Tags: `ai-assistant`, `AI Assistant`
- Summary: Delete conversation
- Description: Delete a specific conversation and all its messages.          **Behavior:**     - Performs soft delete by default (sets deleted_at timestamp)     - Conversation can be restored if needed     - Messages are preserved in database but marked as part of deleted conversation     - User must own the conversation to delete it          **Authentication:** Required (HTTP Basic)          **Audit:** Deletion is logged in audit trail

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `conversation_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Conversation deleted successfully |
| `401` | `N/A` | N/A | Authentication required |
| `404` | `N/A` | N/A | Conversation not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/ai-assistant/generate-insights

- OperationId: `generate_insights_api_v1_ai_assistant_generate_insights_post`
- Tags: `ai-assistant`, `AI Assistant`
- Summary: Generate context insights
- Description: Generate automatic AI insights for an attached context.     Provides initial overview, key findings, and suggested questions.          **Use Case:** Called when user wants AI analysis of attached context          **Features:**     - Quick analysis (5-15 seconds using phi model)     - Data overview and statistics     - Interesting findings and patterns     - Suggested follow-up questions          **Authentication:** Required (HTTP Basic)

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `context_type` | `query` | Yes | string | Context type (dataset, question, report, dashboard) |
| `context_id` | `query` | Yes | integer | Context ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Insights generated successfully |
| `400` | `N/A` | N/A | Invalid context |
| `401` | `N/A` | N/A | Authentication required |
| `404` | `N/A` | N/A | Context not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/ai-assistant/health

- OperationId: `health_check_api_v1_ai_assistant_health_get`
- Tags: `ai-assistant`, `AI Assistant`
- Summary: Health check
- Description: Verify that the AI Assistant service is running and can connect to required services.          **Checks:**     - API service status     - Ollama server connectivity     - Available AI models     - Database connectivity          **Authentication:** Not required

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Service is healthy |
| `503` | `N/A` | N/A | Service is unhealthy |

---

### GET /api/v1/ai-assistant/history

- OperationId: `get_conversation_history_api_v1_ai_assistant_history_get`
- Tags: `ai-assistant`, `AI Assistant`
- Summary: Get conversation history
- Description: Retrieve conversation history for the current user.     Supports search, filtering, and pagination.          **Features:**     - Paginated results with configurable limit     - Search by conversation title or context name     - Filter by context type (dataset, question, report, dashboard)     - Filter by date range     - Ordered by most recently updated          **Authentication:** Required (HTTP Basic)          **Returns:** List of conversations with metadata (excludes deleted conversations)

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `limit` | `query` | No | integer | Maximum number of results (1-100) |
| `offset` | `query` | No | integer | Offset for pagination |
| `search` | `query` | No | anyOf(string | null) | Search term for title or context name |
| `context_type` | `query` | No | anyOf(string | null) | Filter by context type (dataset, question, report, dashboard) |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | List of conversations |
| `400` | `N/A` | N/A | Invalid request parameters |
| `401` | `N/A` | N/A | Authentication required |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/alerts/check

- OperationId: `check_all_alert_rules_api_v1_alerts_check_post`
- Tags: `alerts`
- Summary: Check All Rules
- Description: Check all active alert rules (admin/background job endpoint)

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AlertCheckResponse` | Successful Response |

---

### GET /api/v1/alerts/history

- OperationId: `get_alert_history_api_v1_alerts_history_get`
- Tags: `alerts`
- Summary: Get Alert History
- Description: Get alert history for the current user

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `rule_id` | `query` | No | anyOf(string | null) | Filter by rule ID |
| `limit` | `query` | No | integer | Maximum number of results |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AlertHistoryListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/alerts/history/{history_id}

- OperationId: `get_alert_details_api_v1_alerts_history__history_id__get`
- Tags: `alerts`
- Summary: Get Alert Details
- Description: Get details of a specific alert

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `history_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AlertHistoryResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/alerts/history/{history_id}/feedback

- OperationId: `provide_alert_feedback_api_v1_alerts_history__history_id__feedback_post`
- Tags: `alerts`
- Summary: Provide Alert Feedback
- Description: Provide feedback on alert quality

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `history_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/AlertFeedbackRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AlertHistoryResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/alerts/history/{history_id}/resolve

- OperationId: `resolve_alert_api_v1_alerts_history__history_id__resolve_post`
- Tags: `alerts`
- Summary: Resolve Alert
- Description: Mark an alert as resolved

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `history_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/AlertResolveRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AlertHistoryResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/alerts/rules

- OperationId: `list_alert_rules_api_v1_alerts_rules_get`
- Tags: `alerts`
- Summary: List Alert Rules
- Description: Get all alert rules for the current user

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `enabled_only` | `query` | No | boolean | Show only enabled rules |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AlertRuleListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/alerts/rules

- OperationId: `create_alert_rule_api_v1_alerts_rules_post`
- Tags: `alerts`
- Summary: Create Alert Rule
- Description: Create a new alert rule for monitoring metrics

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/AlertRuleCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/AlertRuleResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/alerts/rules/{rule_id}

- OperationId: `get_alert_rule_api_v1_alerts_rules__rule_id__get`
- Tags: `alerts`
- Summary: Get Alert Rule
- Description: Get details of a specific alert rule

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `rule_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AlertRuleResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PATCH /api/v1/alerts/rules/{rule_id}

- OperationId: `update_alert_rule_api_v1_alerts_rules__rule_id__patch`
- Tags: `alerts`
- Summary: Update Alert Rule
- Description: Update an existing alert rule

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `rule_id` | `path` | Yes | string |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/AlertRuleUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AlertRuleResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/alerts/rules/{rule_id}

- OperationId: `delete_alert_rule_api_v1_alerts_rules__rule_id__delete`
- Tags: `alerts`
- Summary: Delete Alert Rule
- Description: Delete an alert rule

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `rule_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/alerts/rules/{rule_id}/toggle

- OperationId: `toggle_alert_rule_api_v1_alerts_rules__rule_id__toggle_post`
- Tags: `alerts`
- Summary: Toggle Alert Rule
- Description: Enable or disable an alert rule

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `rule_id` | `path` | Yes | string |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/AlertToggleRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AlertRuleResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/analytics-expert/analytics

- OperationId: `get_analytics_api_v1_analytics_expert_analytics_get`
- Tags: `analytics-expert`
- Summary: Get Conversation Analytics
- Description: Get analytics and statistics about conversations for the current user.          **Metrics Included:**     - Total conversations     - Total messages     - Average messages per conversation     - Conversations by context type     - Recent activity (last 7 days, 30 days)     - Most used datasets/contexts          **Authentication:** Required

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Analytics data |

---

### POST /api/v1/analytics-expert/chat

- OperationId: `chat_api_v1_analytics_expert_chat_post`
- Tags: `analytics-expert`
- Summary: Chat with Analytics Expert
- Description: Send an analytics question to the Advanced Analytics Expert.          **Features:**     - Context-aware analytics (attach datasets, reports, charts)     - Intent detection and routing     - Automated insights generation     - ECharts visualizations     - Data tables with TanStack Table compatibility          **Phase 1 Capabilities:**     - Basic descriptive analytics (top N, group by, trends)     - Simple statistical insights     - Bar/line/pie chart generation          **Phase 2 Capabilities (Available Now):**     - ✅ LangGraph workflows with intelligent routing     - ✅ RAG learning from past queries (ChromaDB)     - ✅ Smart suggestions with categorization     - ✅ Response caching for performance     - ✅ Enhanced insight cards with confidence scores     - ✅ Action buttons (Visualize, Dig Deeper, Explain)          **Phase 3 (Coming Soon):**     - Advanced statistical analysis (scipy, statsmodels)     - Predictive analytics with Prophet forecasting     - Root cause analysis and breakdown          **Authentication:** Required (HTTP Basic)          **Rate Limits:** 100 requests per hour per user

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/AnalyticsChatRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AnalyticsChatResponse` | Successful analytics response |
| `400` | `N/A` | N/A | Invalid request (missing context, invalid question, etc.) |
| `401` | `N/A` | N/A | Authentication required |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/analytics-expert/conversations

- OperationId: `get_conversations_api_v1_analytics_expert_conversations_get`
- Tags: `analytics-expert`
- Summary: Get Conversations
- Description: Get list of conversations for the current user with filtering and pagination.          **Filters:**     - search: Search in title or context name     - context_type: Filter by context type (dataset, report, chart, dashboard)     - limit: Max results per page (default: 20)     - offset: Pagination offset (default: 0)          **Authentication:** Required

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `search` | `query` | No | anyOf(string | null) |  |
| `context_type` | `query` | No | anyOf(string | null) |  |
| `limit` | `query` | No | integer |  |
| `offset` | `query` | No | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | List of conversations |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/analytics-expert/conversations/{conversation_id}

- OperationId: `get_conversation_with_messages_api_v1_analytics_expert_conversations__conversation_id__get`
- Tags: `analytics-expert`
- Summary: Get Conversation with Messages
- Description: Get a specific conversation with all its messages.          **Authentication:** Required     **Authorization:** User must own the conversation

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `conversation_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Conversation with messages |
| `404` | `N/A` | N/A | Conversation not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/analytics-expert/conversations/upload

- OperationId: `upload_conversations_api_v1_analytics_expert_conversations_upload_post`
- Tags: `analytics-expert`
- Summary: Upload Conversations (Migration)
- Description: Upload conversations from localStorage for migration to database.     Used for one-time migration when enabling database persistence.          **Authentication:** Required

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | array<object> |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Conversations uploaded successfully |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/analytics-expert/health

- OperationId: `health_check_api_v1_analytics_expert_health_get`
- Tags: `analytics-expert`
- Summary: Health Check
- Description: Check the health status of the Analytics Expert service.          Returns:     - Service status     - Module version and phase     - Component status (DataAnalyzer, IntentDetector, etc.)          **No authentication required**

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/schemas__analytics_expert__HealthResponse` | Service is healthy |

---

### GET /api/v1/analytics-expert/status

- OperationId: `get_status_api_v1_analytics_expert_status_get`
- Tags: `analytics-expert`
- Summary: Get Analytics Expert Status
- Description: Get detailed status information about the Analytics Expert service.          Returns:     - Current phase and capabilities     - Available handlers     - Configuration settings     - Performance metrics (if available)          **Authentication:** Required

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Status information |

---

### POST /api/v1/analytics-expert/suggestions

- OperationId: `get_suggestions_api_v1_analytics_expert_suggestions_post`
- Tags: `analytics-expert`
- Summary: Get Smart Suggestions
- Description: Generate smart question suggestions based on attached contexts.     Uses dataset profiling and RAG to suggest relevant questions.          **Phase 2 Feature**

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | object |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | List of suggested questions |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/analytics/feedback/interaction-outcome

- OperationId: `record_interaction_outcome_api_v1_analytics_feedback_interaction_outcome_post`
- Tags: `analytics-feedback`, `analytics-feedback`
- Summary: Record Interaction Outcome
- Description: Record the outcome of a classification decision (internal API). This is called automatically by the workflow to track whether classification decisions were correct. Args:     interaction_id: Interaction ID     classification_correct: Whether classification was correct     llm_used: Whether LLM was used     quality_score: Quality score of result     collector: FeedbackCollector service      Returns:     Success confirmation

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `interaction_id` | `query` | Yes | string |  |
| `classification_correct` | `query` | Yes | boolean |  |
| `llm_used` | `query` | Yes | boolean |  |
| `quality_score` | `query` | Yes | number |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/analytics/feedback/stats

- OperationId: `get_learning_stats_api_v1_analytics_feedback_stats_get`
- Tags: `analytics-feedback`, `analytics-feedback`
- Summary: Get Learning Stats
- Description: Get learning statistics for admin dashboard. Returns metrics about classification accuracy, feedback trends, and adaptive learning performance. Args:     time_window_hours: Time window for statistics (default: 24 hours)     collector: FeedbackCollector service     learner: AdaptiveLearner service      Returns:     LearningStatsResponse with accuracy and feedback metrics

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `time_window_hours` | `query` | No | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/LearningStatsResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/analytics/feedback/submit

- OperationId: `submit_feedback_api_v1_analytics_feedback_submit_post`
- Tags: `analytics-feedback`, `analytics-feedback`
- Summary: Submit Feedback
- Description: Submit user feedback for an analytics response. This endpoint collects explicit user feedback (thumbs up/down, corrections) to improve classification accuracy through adaptive learning. Args:     feedback_request: Feedback details     collector: FeedbackCollector service      Returns:     FeedbackResponse with success status and feedback ID

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/FeedbackRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/FeedbackResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/analytics/query

- OperationId: `run_analytics_query_api_v1_analytics_query_get`
- Tags: `analytics`
- Summary: Run Analytics Query
- Description: Run an analytics query against the data. This is a placeholder endpoint for the MVP. In the future, it will execute the query against the specified data source using DuckDB.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `query` | `query` | Yes | string | SQL query to execute |
| `data_source_id` | `query` | No | anyOf(string | null) | Data source ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AnalyticsResult` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/analytics/summary/{data_source_id}/{table_name}

- OperationId: `get_summary_statistics_api_v1_analytics_summary__data_source_id___table_name__get`
- Tags: `analytics`
- Summary: Get Summary Statistics
- Description: Get summary statistics for a table. This is a placeholder endpoint for the MVP. In the future, it will provide actual summary statistics for the specified table.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `data_source_id` | `path` | Yes | string |  |
| `table_name` | `path` | Yes | string |  |
| `limit` | `query` | No | anyOf(integer | null) | Maximum number of rows to analyze |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AnalyticsSummary` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/audit/audit

- OperationId: `list_audit_logs_api_v1_audit_audit_get`
- Tags: `audit`, `audit`
- Summary: List Audit Logs
- Description: List audit logs with optional filtering (Admin only). Returns paginated list of audit log entries.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `skip` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |
| `action` | `query` | No | anyOf(string | null) | Filter by action type |
| `actor_id` | `query` | No | anyOf(integer | null) | Filter by actor user ID |
| `target_id` | `query` | No | anyOf(integer | null) | Filter by target user ID |
| `start_date` | `query` | No | anyOf(string | null) | Filter by start date |
| `end_date` | `query` | No | anyOf(string | null) | Filter by end date |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AuditLogListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/audit/audit/actions

- OperationId: `list_audit_actions_api_v1_audit_audit_actions_get`
- Tags: `audit`, `audit`
- Summary: List Audit Actions
- Description: List all available audit action types (Admin only).

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<string> | Successful Response |

---

### GET /api/v1/audit/audit/user/{user_id}

- OperationId: `get_user_audit_logs_api_v1_audit_audit_user__user_id__get`
- Tags: `audit`, `audit`
- Summary: Get User Audit Logs
- Description: Get audit logs for a specific user (as actor or target) (Admin only).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `user_id` | `path` | Yes | integer |  |
| `skip` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AuditLogListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/auth/login

- OperationId: `login_api_v1_auth_login_post`
- Tags: `auth`
- Summary: Login
- Description: Login endpoint using HTTP Basic Authentication. This endpoint validates the provided HTTP Basic Authentication credentials and returns user information if authentication is successful. Args:     credentials: HTTP Basic credentials (username/password)     db: Database session      Returns:     User information if authentication is successful      Raises:     HTTPException: If authentication fails

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/LoginResponse` | Successful Response |

---

### POST /api/v1/auth/logout

- OperationId: `logout_api_v1_auth_logout_post`
- Tags: `auth`
- Summary: Logout
- Description: Logout endpoint - for future token invalidation if needed. Currently just returns success as HTTP Basic Authentication is stateless. Returns:     Success message

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |

---

### GET /api/v1/auth/me

- OperationId: `read_users_me_api_v1_auth_me_get`
- Tags: `auth`
- Summary: Read Users Me
- Description: Get current user information. This endpoint returns information about the currently authenticated user. Args:     current_user: Current authenticated user      Returns:     Current user information

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/User` | Successful Response |

---

### GET /api/v1/columns/

- OperationId: `list_columns_api_v1_columns__get`
- Tags: `columns`
- Summary: List Columns
- Description: List columns from the metadata database with optional search.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `query` | No | anyOf(integer | null) |  |
| `sync_enabled` | `query` | No | anyOf(boolean | null) |  |
| `search` | `query` | No | anyOf(string | null) | Search columns by name, type, or description |
| `skip` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ColumnList` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/columns/

- OperationId: `create_column_api_v1_columns__post`
- Tags: `columns`
- Summary: Create Column
- Description: Create a new column in the metadata database.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ColumnCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/ColumnResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/columns/{column_id}

- OperationId: `get_column_api_v1_columns__column_id__get`
- Tags: `columns`
- Summary: Get Column
- Description: Get a specific column by ID.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `column_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ColumnResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/columns/{column_id}

- OperationId: `update_column_api_v1_columns__column_id__put`
- Tags: `columns`
- Summary: Update Column
- Description: Update an existing column.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `column_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ColumnUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ColumnResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/columns/{column_id}

- OperationId: `delete_column_api_v1_columns__column_id__delete`
- Tags: `columns`
- Summary: Delete Column
- Description: Delete a column.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `column_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/columns/bulk-sync-update

- OperationId: `bulk_update_column_sync_api_v1_columns_bulk_sync_update_post`
- Tags: `columns`
- Summary: Bulk Update Column Sync
- Description: Bulk enable or disable synchronization for multiple columns. This allows updating sync status for multiple columns in a single request.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/BulkColumnSyncUpdateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/BulkColumnSyncUpdateResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/dashboards/

- OperationId: `get_dashboards_api_v1_dashboards__get`
- Tags: `dashboards`
- Summary: Get Dashboards
- Description: Get dashboards with filtering and pagination.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `skip` | `query` | No | integer | Number of dashboards to skip for pagination |
| `limit` | `query` | No | integer | Number of dashboards to return |
| `category_id` | `query` | No | anyOf(integer | null) | Filter by category ID |
| `dashboard_status` | `query` | No | anyOf(ref: `#/components/schemas/DashboardStatus` | null) | Filter by dashboard status |
| `search` | `query` | No | anyOf(string | null) | Search dashboards by name or description |
| `tags` | `query` | No | anyOf(string | null) | Filter by tags (comma-separated) |
| `groups` | `query` | No | anyOf(string | null) | Comma-separated group IDs to filter by |
| `group_filter_mode` | `query` | No | anyOf(string | null) | 'any' (OR) or 'all' (AND) for group filtering |
| `include_ungrouped` | `query` | No | boolean | Include dashboards without any groups |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DashboardListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/dashboards/

- OperationId: `create_dashboard_api_v1_dashboards__post`
- Tags: `dashboards`
- Summary: Create Dashboard
- Description: Create a new dashboard.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/DashboardResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/dashboards/{dashboard_id}

- OperationId: `get_dashboard_api_v1_dashboards__dashboard_id__get`
- Tags: `dashboards`
- Summary: Get Dashboard
- Description: Get a dashboard by ID.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DashboardResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/dashboards/{dashboard_id}

- OperationId: `update_dashboard_api_v1_dashboards__dashboard_id__put`
- Tags: `dashboards`
- Summary: Update Dashboard
- Description: Update a dashboard.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DashboardResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/dashboards/{dashboard_id}

- OperationId: `delete_dashboard_api_v1_dashboards__dashboard_id__delete`
- Tags: `dashboards`
- Summary: Delete Dashboard
- Description: Delete a dashboard.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/dashboards/{dashboard_id}/access

- OperationId: `list_dashboard_access_api_v1_dashboards__dashboard_id__access_get`
- Tags: `dashboards`
- Summary: List Dashboard Access
- Description: List all access entries for a dashboard. Admin on the dashboard required.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/DashboardAccessWithUser`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/dashboards/{dashboard_id}/access

- OperationId: `grant_dashboard_access_api_v1_dashboards__dashboard_id__access_post`
- Tags: `dashboards`
- Summary: Grant Dashboard Access
- Description: Grant viewer access to a user for a dashboard. Admin on the dashboard required.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardAccessCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/DashboardAccessWithUser` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/dashboards/{dashboard_id}/access/{access_id}

- OperationId: `update_dashboard_access_api_v1_dashboards__dashboard_id__access__access_id__put`
- Tags: `dashboards`
- Summary: Update Dashboard Access
- Description: Update an existing dashboard access entry. Admin on the dashboard required.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |
| `access_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardAccessUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DashboardAccessWithUser` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/dashboards/{dashboard_id}/access/{access_id}

- OperationId: `revoke_dashboard_access_api_v1_dashboards__dashboard_id__access__access_id__delete`
- Tags: `dashboards`
- Summary: Revoke Dashboard Access
- Description: Revoke a dashboard access entry. Admin on the dashboard required.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |
| `access_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/dashboards/{dashboard_id}/columns

- OperationId: `get_dashboard_columns_api_v1_dashboards__dashboard_id__columns_get`
- Tags: `dashboards`
- Summary: Get Dashboard Columns
- Description: Get available columns from all widgets in the dashboard for filtering. Returns aggregated column metadata from questions and reports in the dashboard.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DashboardColumnsResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/dashboards/{dashboard_id}/data

- OperationId: `get_dashboard_data_api_v1_dashboards__dashboard_id__data_get`
- Tags: `dashboards`
- Summary: Get Dashboard Data
- Description: Get dashboard data with all widget contents.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |
| `refresh` | `query` | No | boolean |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| No | `application/json` | ref: `#/components/schemas/Body_get_dashboard_data_api_v1_dashboards__dashboard_id__data_get` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DashboardDataResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/dashboards/{dashboard_id}/duplicate

- OperationId: `duplicate_dashboard_api_v1_dashboards__dashboard_id__duplicate_post`
- Tags: `dashboards`
- Summary: Duplicate Dashboard
- Description: Duplicate a dashboard.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardDuplicateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DashboardResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/dashboards/{dashboard_id}/filter-sets

- OperationId: `get_dashboard_filter_sets_api_v1_dashboards__dashboard_id__filter_sets_get`
- Tags: `dashboards`
- Summary: Get Dashboard Filter Sets
- Description: Get all filter sets for a dashboard.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/DashboardFilterSet`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/dashboards/{dashboard_id}/filter-sets

- OperationId: `create_dashboard_filter_set_api_v1_dashboards__dashboard_id__filter_sets_post`
- Tags: `dashboards`
- Summary: Create Dashboard Filter Set
- Description: Create a new filter set for a dashboard.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardFilterSetCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/DashboardFilterSetResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/dashboards/{dashboard_id}/filter-sets/{filter_set_id}

- OperationId: `update_dashboard_filter_set_api_v1_dashboards__dashboard_id__filter_sets__filter_set_id__put`
- Tags: `dashboards`
- Summary: Update Dashboard Filter Set
- Description: Update a dashboard filter set.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |
| `filter_set_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardFilterSetUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DashboardFilterSetResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/dashboards/{dashboard_id}/filter-sets/{filter_set_id}

- OperationId: `delete_dashboard_filter_set_api_v1_dashboards__dashboard_id__filter_sets__filter_set_id__delete`
- Tags: `dashboards`
- Summary: Delete Dashboard Filter Set
- Description: Delete a dashboard filter set.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |
| `filter_set_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/dashboards/{dashboard_id}/filters

- OperationId: `get_dashboard_filters_api_v1_dashboards__dashboard_id__filters_get`
- Tags: `dashboards`
- Summary: Get Dashboard Filters
- Description: Get all filters for a dashboard.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/DashboardFilter`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/dashboards/{dashboard_id}/filters

- OperationId: `create_dashboard_filter_api_v1_dashboards__dashboard_id__filters_post`
- Tags: `dashboards`
- Summary: Create Dashboard Filter
- Description: Create a new filter for a dashboard.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardFilterCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/DashboardFilterResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/dashboards/{dashboard_id}/filters/{filter_id}

- OperationId: `update_dashboard_filter_api_v1_dashboards__dashboard_id__filters__filter_id__put`
- Tags: `dashboards`
- Summary: Update Dashboard Filter
- Description: Update a dashboard filter.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |
| `filter_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardFilterUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DashboardFilterResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/dashboards/{dashboard_id}/filters/{filter_id}

- OperationId: `delete_dashboard_filter_api_v1_dashboards__dashboard_id__filters__filter_id__delete`
- Tags: `dashboards`
- Summary: Delete Dashboard Filter
- Description: Delete a dashboard filter.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |
| `filter_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/dashboards/{dashboard_id}/layout

- OperationId: `update_dashboard_layout_api_v1_dashboards__dashboard_id__layout_put`
- Tags: `dashboards`
- Summary: Update Dashboard Layout
- Description: Update dashboard widget layout positions.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardLayoutUpdateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DashboardResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/dashboards/{dashboard_id}/me/access

- OperationId: `get_my_dashboard_access_api_v1_dashboards__dashboard_id__me_access_get`
- Tags: `dashboards`
- Summary: Get My Dashboard Access
- Description: Get current user's access level for the specified dashboard.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/MeAccessResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/dashboards/{dashboard_id}/refresh

- OperationId: `refresh_dashboard_api_v1_dashboards__dashboard_id__refresh_post`
- Tags: `dashboards`
- Summary: Refresh Dashboard
- Description: Refresh dashboard data for specified widgets or all widgets.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardRefreshRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DashboardRefreshResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/dashboards/{dashboard_id}/widgets

- OperationId: `create_dashboard_widget_api_v1_dashboards__dashboard_id__widgets_post`
- Tags: `dashboards`
- Summary: Create Dashboard Widget
- Description: Create a new widget in a dashboard.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dashboard_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardWidgetCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/DashboardWidget` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/dashboards/categories

- OperationId: `get_dashboard_categories_api_v1_dashboards_categories_get`
- Tags: `dashboards`
- Summary: Get Dashboard Categories
- Description: Get all dashboard categories.

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/DashboardCategory`> | Successful Response |

---

### POST /api/v1/dashboards/categories

- OperationId: `create_dashboard_category_api_v1_dashboards_categories_post`
- Tags: `dashboards`
- Summary: Create Dashboard Category
- Description: Create a new dashboard category.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardCategoryCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/DashboardCategory` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/dashboards/categories/{category_id}

- OperationId: `update_dashboard_category_api_v1_dashboards_categories__category_id__put`
- Tags: `dashboards`
- Summary: Update Dashboard Category
- Description: Update a dashboard category.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `category_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardCategoryUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DashboardCategory` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/dashboards/categories/{category_id}

- OperationId: `delete_dashboard_category_api_v1_dashboards_categories__category_id__delete`
- Tags: `dashboards`
- Summary: Delete Dashboard Category
- Description: Delete a dashboard category.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `category_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/dashboards/widgets/{widget_id}

- OperationId: `update_dashboard_widget_api_v1_dashboards_widgets__widget_id__put`
- Tags: `dashboards`
- Summary: Update Dashboard Widget
- Description: Update a dashboard widget.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `widget_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DashboardWidgetUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DashboardWidget` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/dashboards/widgets/{widget_id}

- OperationId: `delete_dashboard_widget_api_v1_dashboards_widgets__widget_id__delete`
- Tags: `dashboards`
- Summary: Delete Dashboard Widget
- Description: Delete a dashboard widget.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `widget_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/data-sources/

- OperationId: `list_data_sources_api_v1_data_sources__get`
- Tags: `data-sources`
- Summary: List Data Sources
- Description: List all configured data sources.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `skip` | `query` | No | integer | Number of records to skip |
| `limit` | `query` | No | integer | Maximum number of records to return |
| `status` | `query` | No | anyOf(string | null) | Filter by connection status |
| `tags` | `query` | No | anyOf(string | null) | Filter by tags (comma-separated) |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DataSourceListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/data-sources/

- OperationId: `create_data_source_api_v1_data_sources__post`
- Tags: `data-sources`
- Summary: Create Data Source
- Description: Create a new data source configuration.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DataSourceCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/DataSourceResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/data-sources/{data_source_id}/sync

- OperationId: `sync_data_source_api_v1_data_sources__data_source_id__sync_post`
- Tags: `sync`, `sync`
- Summary: Sync Data Source
- Description: Synchronize all tables in a data source using background processing. Uses thread pool for non-blocking background execution. Returns immediately with a task_id for status tracking. Args:     data_source_id: ID of the data source to sync     request: Sync configuration     db: Database session      Returns:     Sync operation result with task ID for status tracking

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `data_source_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/SyncDataSourceRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SyncResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/data-sources/{data_source_id}/sync-inheritance-stats

- OperationId: `get_sync_inheritance_stats_api_v1_data_sources__data_source_id__sync_inheritance_stats_get`
- Tags: `data-sources`
- Summary: Get Sync Inheritance Stats
- Description: Get statistics about tables inheriting or overriding sync settings from their data source.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `data_source_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/data-sources/{source_id}

- OperationId: `get_data_source_api_v1_data_sources__source_id__get`
- Tags: `data-sources`
- Summary: Get Data Source
- Description: Get a specific data source by ID.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `source_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DataSourceResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/data-sources/{source_id}

- OperationId: `update_data_source_api_v1_data_sources__source_id__put`
- Tags: `data-sources`
- Summary: Update Data Source
- Description: Update an existing data source configuration.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `source_id` | `path` | Yes | string |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DataSourceUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DataSourceResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/data-sources/{source_id}

- OperationId: `delete_data_source_api_v1_data_sources__source_id__delete`
- Tags: `data-sources`
- Summary: Delete Data Source
- Description: Delete a data source configuration.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `source_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/data-sources/{source_id}/sync-tables

- OperationId: `list_sync_tables_api_v1_data_sources__source_id__sync_tables_get`
- Tags: `sync`, `sync`
- Summary: List Sync Tables
- Description: List tables in a data source with sync-specific filtering and pagination.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `source_id` | `path` | Yes | string |  |
| `table_name` | `query` | No | anyOf(string | null) | Filter by table name |
| `sync_enabled` | `query` | No | anyOf(boolean | null) | Filter by sync enabled status |
| `limit` | `query` | No | integer | Maximum number of records to return |
| `offset` | `query` | No | integer | Number of records to skip |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/api__v1__endpoints__sync__TableInfo`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/data-sources/{source_id}/tables

- OperationId: `list_tables_api_v1_data_sources__source_id__tables_get`
- Tags: `data-sources`
- Summary: List Tables
- Description: List tables in a data source.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `source_id` | `path` | Yes | string |  |
| `schema` | `query` | No | anyOf(string | null) |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/api__v1__endpoints__data_sources__TableInfo`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/data-sources/{source_id}/tables/{schema}/{table}/columns

- OperationId: `list_columns_api_v1_data_sources__source_id__tables__schema___table__columns_get`
- Tags: `data-sources`
- Summary: List Columns
- Description: List columns in a specific table.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `source_id` | `path` | Yes | string |  |
| `schema` | `path` | Yes | string |  |
| `table` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/ColumnInfo`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/data-sources/{source_id}/test-connection

- OperationId: `test_existing_connection_api_v1_data_sources__source_id__test_connection_post`
- Tags: `data-sources`
- Summary: Test Existing Connection
- Description: Test connection to a data source.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `source_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ConnectionTestResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/data-sources/test-connection

- OperationId: `test_connection_api_v1_data_sources_test_connection_post`
- Tags: `data-sources`
- Summary: Test Connection
- Description: Test connection to a data source without saving it.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ConnectionTestRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ConnectionTestResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/datasets/

- OperationId: `list_datasets_api_v1_datasets__get`
- Tags: `datasets`, `Datasets`
- Summary: List Datasets
- Description: Retrieve a paginated list of datasets with optional filtering.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `skip` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |
| `status` | `query` | No | anyOf(string | null) |  |
| `search` | `query` | No | anyOf(string | null) |  |
| `groups` | `query` | No | anyOf(string | null) |  |
| `group_filter_mode` | `query` | No | anyOf(string | null) |  |
| `include_ungrouped` | `query` | No | boolean |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/Dataset`> | List of dataset objects |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/datasets/

- OperationId: `create_dataset_api_v1_datasets__post`
- Tags: `datasets`, `Datasets`
- Summary: Create Dataset
- Description: Create a new dataset with the provided configuration.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DatasetCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/Dataset` | Dataset created successfully |
| `400` | `N/A` | N/A | Invalid input data |
| `401` | `N/A` | N/A | Unauthorized |
| `409` | `N/A` | N/A | Dataset with this name already exists |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/datasets/{dataset_id}

- OperationId: `get_dataset_api_v1_datasets__dataset_id__get`
- Tags: `datasets`, `Datasets`
- Summary: Get Dataset by ID
- Description: Retrieve a dataset by its unique identifier.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | The ID of the dataset to retrieve |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/Dataset` | Dataset found and returned |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/datasets/{dataset_id}

- OperationId: `update_dataset_api_v1_datasets__dataset_id__put`
- Tags: `datasets`, `Datasets`
- Summary: Update Dataset
- Description: Update an existing dataset's configuration.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | The ID of the dataset to update |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DatasetUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/Dataset` | Dataset updated successfully |
| `400` | `N/A` | N/A | Invalid input data |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Dataset not found |
| `409` | `N/A` | N/A | Dataset with this name already exists |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### DELETE /api/v1/datasets/{dataset_id}

- OperationId: `delete_dataset_api_v1_datasets__dataset_id__delete`
- Tags: `datasets`, `Datasets`
- Summary: Delete Dataset
- Description: Permanently delete a dataset and all its versions.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | The ID of the dataset to delete |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Dataset deleted successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/datasets/{dataset_id}/columns/{column_name}/unique-values

- OperationId: `get_unique_column_values_api_v1_datasets__dataset_id__columns__column_name__unique_values_get`
- Tags: `datasets`, `Datasets`
- Summary: Get Unique Column Values
- Description: Get unique values for a specific column from a materialized dataset.          This endpoint queries the dataset's parquet file to retrieve distinct values     for the specified column. Useful for populating filter dropdowns and value selection.          **Features:**     - Returns up to `limit` unique values (default: 100)     - Supports search/filtering with the `search` parameter     - Returns total count and truncation indicator     - Works with any column in the materialized dataset

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | The ID of the dataset |
| `column_name` | `path` | Yes | string | The name of the column |
| `limit` | `query` | No | integer |  |
| `search` | `query` | No | anyOf(string | null) |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Unique values retrieved successfully |
| `400` | `N/A` | N/A | Invalid request or dataset not materialized |
| `401` | `N/A` | N/A | Unauthorized |
| `404` | `N/A` | N/A | Dataset or column not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/datasets/{dataset_id}/data

- OperationId: `get_materialized_dataset_data_api_v1_datasets__dataset_id__data_get`
- Tags: `datasets`, `Datasets`
- Summary: Get Materialized Dataset Data
- Description: Get data directly from the materialized dataset parquet file.          This endpoint reads data from the materialized parquet file, not by re-executing     the dataset query. Use this for viewing materialized dataset data.          **Features:**     - Reads directly from parquet file     - Supports pagination with offset and limit     - Fast and efficient     - Returns actual materialized column names

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | The ID of the dataset |
| `offset` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DatasetPreviewResponse` | Data retrieved successfully |
| `400` | `N/A` | N/A | Dataset not materialized |
| `401` | `N/A` | N/A | Unauthorized |
| `404` | `N/A` | N/A | Dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/datasets/{dataset_id}/data

- OperationId: `post_materialized_dataset_data_api_v1_datasets__dataset_id__data_post`
- Tags: `datasets`, `Datasets`
- Summary: Get Materialized Dataset Data with Filters (POST)
- Description: Get data from materialized dataset parquet file with runtime filters.          This POST endpoint accepts filters in the request body and applies them     at runtime using DuckDB WHERE clauses without re-materialization.          **Request Body:**     - offset: Number of rows to skip     - limit: Maximum number of rows to return     - filters: Array of filter conditions          **Filter Format:**     ```json     {       "offset": 0,       "limit": 100,       "filters": [         {           "field": "column_name",           "operator": "equals",           "value": "some_value"         }       ]     }     ```

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DatasetDataRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DatasetPreviewResponse` | Data retrieved successfully |
| `400` | `N/A` | N/A | Dataset not materialized or invalid filter |
| `401` | `N/A` | N/A | Unauthorized |
| `404` | `N/A` | N/A | Dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/datasets/{dataset_id}/datasetschema

- OperationId: `get_dataset_schema_api_v1_datasets__dataset_id__datasetschema_get`
- Tags: `datasets`, `Datasets`
- Summary: Get Dataset Schema
- Description: Retrieve the schema of a dataset from its materialized parquet file.          This endpoint reads the parquet file associated with the dataset and returns     its schema information, including column names, data types, and other metadata.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | The ID of the dataset |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DatasetSchemaResponse` | Schema retrieved successfully |
| `400` | `N/A` | N/A | Invalid request or dataset not materialized |
| `401` | `N/A` | N/A | Unauthorized |
| `404` | `N/A` | N/A | Dataset not found or parquet file not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/datasets/{dataset_id}/duplicate

- OperationId: `duplicate_dataset_api_v1_datasets__dataset_id__duplicate_post`
- Tags: `datasets`, `Datasets`
- Summary: Duplicate Dataset
- Description: Create a duplicate copy of an existing dataset.          The duplicate will have:     - Same definition, configuration, and output columns     - New name with " (Copy)" or " (Copy N)" appended     - Status set to 'draft'     - No materialized data (must be materialized separately)     - Sync disabled by default          This is useful for creating variations of existing datasets or     for testing modifications without affecting the original.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | The ID of the dataset to duplicate |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/Dataset` | Dataset duplicated successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `404` | `N/A` | N/A | Source dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/datasets/{dataset_id}/generate-profile

- OperationId: `generate_dataset_profile_api_v1_datasets__dataset_id__generate_profile_post`
- Tags: `datasets`, `Datasets`, `AI Assistant`
- Summary: Generate AI Profile for Dataset
- Description: Generate an AI-powered dataset profile with categorized question suggestions.          This endpoint analyzes the dataset and generates:     - Business domain identification     - Key insights and statistics     - 4 categories of suggested questions:       - Descriptive: Basic exploration       - Statistical: Aggregations and calculations       - Predictive: Trends and forecasts       - Advanced: Complex multi-dimensional analysis          The profile is cached for 30 days and auto-refreshed on schema changes.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | Dataset ID |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| No | `application/json` | ref: `#/components/schemas/GenerateProfileRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Profile generated successfully |
| `400` | `N/A` | N/A | Dataset not materialized or invalid |
| `404` | `N/A` | N/A | Dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Profile generation failed |

---

### POST /api/v1/datasets/{dataset_id}/materialize

- OperationId: `materialize_dataset_api_v1_datasets__dataset_id__materialize_post`
- Tags: `datasets`, `Datasets`
- Summary: Materialize Dataset (Deprecated)
- Description: [DEPRECATED] Materialize a dataset to an optimized file format for efficient querying.          This endpoint is deprecated and will be removed in a future version.     Please use the /api/v1/datasets/{dataset_id}/sync endpoint instead, which now handles materialization.          This operation converts the dataset into a columnar format (e.g., Parquet)     that is optimized for analytical queries. The materialized data can be     partitioned by specified columns for improved query performance.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | The ID of the dataset to materialize |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DatasetMaterializeRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `202` | `application/json` | ref: `#/components/schemas/DatasetMaterializeResponse` | Materialization job started successfully |
| `400` | `N/A` | N/A | Invalid request or dataset configuration |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/datasets/{dataset_id}/measures

- OperationId: `list_measures_api_v1_datasets__dataset_id__measures_get`
- Tags: `measures`
- Summary: List all measures for a dataset
- Description: Returns all measure definitions for the specified dataset.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer |  |
| `certified_only` | `query` | No | boolean |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/MeasureDefinitionList` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/datasets/{dataset_id}/measures

- OperationId: `create_measure_api_v1_datasets__dataset_id__measures_post`
- Tags: `measures`
- Summary: Create a new measure
- Description: Creates a new measure definition for the specified dataset.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/MeasureDefinitionCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/MeasureDefinition` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/datasets/{dataset_id}/measures/{measure_id}

- OperationId: `get_measure_api_v1_datasets__dataset_id__measures__measure_id__get`
- Tags: `measures`
- Summary: Get a single measure
- Description: Returns a single measure definition by ID.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer |  |
| `measure_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/MeasureDefinition` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/datasets/{dataset_id}/measures/{measure_id}

- OperationId: `update_measure_api_v1_datasets__dataset_id__measures__measure_id__put`
- Tags: `measures`
- Summary: Update a measure
- Description: Updates an existing measure definition.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer |  |
| `measure_id` | `path` | Yes | string |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/MeasureDefinitionUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/MeasureDefinition` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/datasets/{dataset_id}/measures/{measure_id}

- OperationId: `delete_measure_api_v1_datasets__dataset_id__measures__measure_id__delete`
- Tags: `measures`
- Summary: Delete a measure
- Description: Deletes a measure definition.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer |  |
| `measure_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/datasets/{dataset_id}/measures/{measure_id}/certify

- OperationId: `certify_measure_api_v1_datasets__dataset_id__measures__measure_id__certify_post`
- Tags: `measures`
- Summary: Certify or uncertify a measure
- Description: Marks a measure as certified (or removes certification).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer |  |
| `measure_id` | `path` | Yes | string |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/MeasureCertifyRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/MeasureDefinition` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/datasets/{dataset_id}/measures/{measure_id}/sql

- OperationId: `get_measure_sql_api_v1_datasets__dataset_id__measures__measure_id__sql_get`
- Tags: `measures`
- Summary: Get SQL for a measure
- Description: Returns the generated SQL expression for a measure.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer |  |
| `measure_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/datasets/{dataset_id}/measures/validate

- OperationId: `validate_measure_api_v1_datasets__dataset_id__measures_validate_post`
- Tags: `measures`
- Summary: Validate a measure configuration
- Description: Validates a measure configuration without creating it.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/MeasureValidateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/MeasureValidateResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/datasets/{dataset_id}/output-columns

- OperationId: `get_dataset_output_columns_normalized_api_v1_datasets__dataset_id__output_columns_get`
- Tags: `datasets`, `Datasets`
- Summary: Get Dataset Output Columns (Normalized)
- Description: Get dataset output columns in unified format compatible with table columns

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DatasetOutputColumnsResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/datasets/{dataset_id}/profile

- OperationId: `get_dataset_profile_api_v1_datasets__dataset_id__profile_get`
- Tags: `datasets`, `Datasets`, `AI Assistant`
- Summary: Get Dataset AI Profile
- Description: Retrieve the cached AI profile for a dataset.          Returns the previously generated profile if available, or indicates     that a new profile needs to be generated.          Profile includes:     - Business context and domain     - Dataset statistics     - Categorized question suggestions     - Key insights

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | Dataset ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Profile retrieved successfully |
| `404` | `N/A` | N/A | Dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Failed to retrieve profile |

---

### POST /api/v1/datasets/{dataset_id}/refresh-schema

- OperationId: `refresh_sql_dataset_schema_api_v1_datasets__dataset_id__refresh_schema_post`
- Tags: `datasets`, `Datasets`
- Summary: Refresh SQL Dataset Schema
- Description: Manually refresh the output_definition (column schema) for a SQL dataset.     Uses LIMIT 0 query to extract column names and types without executing full query.     Useful when SQL query is updated but columns aren't showing up.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | The ID of the SQL dataset |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Schema refreshed successfully |
| `400` | `N/A` | N/A | Not a SQL dataset or missing required fields |
| `404` | `N/A` | N/A | Dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/datasets/{dataset_id}/sync

- OperationId: `sync_dataset_api_v1_datasets__dataset_id__sync_post`
- Tags: `datasets`, `Dataset Operations`
- Summary: Trigger Dataset Sync/Materialization (Async)
- Description: Manually trigger materialization of the dataset (works for both wizard and custom SQL datasets).          This endpoint initiates an **asynchronous** background process to materialize the dataset     to Parquet format. The operation does not block and returns immediately.          **Supported Dataset Types:**     - **Wizard Datasets** (join/union): Materializes based on table joins and column selections     - **Custom SQL Datasets**: Executes SQL query and materializes results          **Process:**     1. Returns immediately with 202 Accepted status     2. Background job materializes dataset to Parquet     3. Poll `/datasets/{id}/sync/status` to check progress     4. Dataset becomes available for Reports/Questions when complete

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | The ID of the dataset to sync/materialize |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `202` | `application/json` | object | Materialization job started successfully |
| `400` | `N/A` | N/A | Invalid request or materialization not possible |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/datasets/{dataset_id}/sync/status

- OperationId: `get_sync_status_api_v1_datasets__dataset_id__sync_status_get`
- Tags: `datasets`, `Dataset Operations`
- Summary: Get Dataset Sync Status
- Description: Retrieve the current sync status and next scheduled sync time for a dataset.          This endpoint provides information about the last sync operation, including     its status, when it occurred, and when the next sync is scheduled.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | The ID of the dataset |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DatasetSyncStatus` | Sync status retrieved successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/datasets/{dataset_id}/versions

- OperationId: `list_dataset_versions_api_v1_datasets__dataset_id__versions_get`
- Tags: `datasets`, `Dataset Versions`
- Summary: List Dataset Versions
- Description: Retrieve all versions of a specific dataset.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | The ID of the dataset |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/DatasetVersion`> | Versions retrieved successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/datasets/{dataset_id}/versions/{version_id}

- OperationId: `get_dataset_version_api_v1_datasets__dataset_id__versions__version_id__get`
- Tags: `datasets`, `Dataset Versions`
- Summary: Get Dataset Version
- Description: Retrieve a specific version of a dataset by its version ID.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer | The ID of the dataset |
| `version_id` | `path` | Yes | string | The ID of the version to retrieve |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DatasetVersion` | Version retrieved successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Version or dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/datasets/available-as-source

- OperationId: `get_available_datasets_for_source_api_v1_datasets_available_as_source_get`
- Tags: `datasets`, `Datasets`
- Summary: Get Available Datasets for Sources
- Description: Get datasets that can be used as sources (active + materialized only)

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `search` | `query` | No | anyOf(string | null) |  |
| `limit` | `query` | No | integer |  |
| `offset` | `query` | No | integer |  |
| `exclude_id` | `query` | No | anyOf(integer | null) |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AvailableDatasetsResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/datasets/custom-sql/{dataset_id}

- OperationId: `update_custom_sql_dataset_api_v1_datasets_custom_sql__dataset_id__put`
- Tags: `Custom SQL Datasets`, `Custom SQL Datasets`
- Summary: Update Custom SQL Dataset
- Description: Update an existing custom SQL dataset.          **Required Role**: Admin or Analyst          This endpoint allows updating:     - Dataset name and description     - SQL query (will re-validate)     - Column metadata     - Sync configuration     - Status          If the SQL query is changed, it will be re-validated and the dataset     definition will be updated accordingly.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `dataset_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/CustomSQLDatasetUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/Dataset` | Dataset updated successfully |
| `400` | `N/A` | N/A | Invalid SQL query or dataset data |
| `401` | `N/A` | N/A | Unauthorized |
| `404` | `N/A` | N/A | Dataset not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/datasets/custom-sql/create

- OperationId: `create_custom_sql_dataset_api_v1_datasets_custom_sql_create_post`
- Tags: `Custom SQL Datasets`, `Custom SQL Datasets`
- Summary: Create Custom SQL Dataset
- Description: Create a new dataset using a custom SQL query.          **Required Role**: Admin or Analyst          This endpoint:     - Validates the SQL query     - Extracts column metadata from query results     - Creates a dataset record with definition_type='sql'     - Stores the SQL query in the dataset definition          The dataset can then be materialized and used in reports/charts.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/CustomSQLDatasetCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/Dataset` | Dataset created successfully |
| `400` | `N/A` | N/A | Invalid SQL query or dataset data |
| `401` | `N/A` | N/A | Unauthorized |
| `409` | `N/A` | N/A | Dataset with this name already exists |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/datasets/custom-sql/preview

- OperationId: `preview_sql_query_api_v1_datasets_custom_sql_preview_post`
- Tags: `Custom SQL Datasets`, `Custom SQL Datasets`
- Summary: Preview SQL Query Results
- Description: Execute SQL query and return preview results.          **Required Role**: Admin or Analyst          This endpoint:     - Validates the SQL query first     - Executes the query with a LIMIT (default 100 rows)     - Returns sample data, schema, and execution time     - Does not materialize or save results          Use this to test queries before creating a dataset.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/CustomSQLQueryRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/CustomSQLDatasetPreview` | Preview completed (check 'success' field for result) |
| `401` | `N/A` | N/A | Unauthorized |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/datasets/custom-sql/tables

- OperationId: `get_available_tables_api_v1_datasets_custom_sql_tables_get`
- Tags: `Custom SQL Datasets`, `Custom SQL Datasets`
- Summary: Get Available Tables with Search
- Description: Get list of tables available for SQL queries with server-side search.          **Required Role**: Admin or Analyst          **Query Parameters**:     - search: Filter tables by name (case-insensitive)     - limit: Max results (default 20, max 100)     - offset: Pagination offset     - include_columns: Load full column metadata (default false)          Returns tables that:     - Have parquet files materialized     - User has permission to access (based on role)     - Match search criteria (if provided)

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `search` | `query` | No | string |  |
| `limit` | `query` | No | integer |  |
| `offset` | `query` | No | integer |  |
| `include_columns` | `query` | No | boolean |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AvailableTablesResponse` | Tables retrieved successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/datasets/custom-sql/tables/batch

- OperationId: `get_tables_by_ids_api_v1_datasets_custom_sql_tables_batch_post`
- Tags: `Custom SQL Datasets`, `Custom SQL Datasets`
- Summary: Get Specific Tables by IDs
- Description: Get full details (including columns) for specific tables by IDs.          **Required Role**: Admin or Analyst          This endpoint is used to load complete metadata for selected tables,     including all column information. Useful for loading details of tables     that the user has explicitly selected to work with.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | array<integer> |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AvailableTablesResponse` | Tables retrieved successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/datasets/custom-sql/validate

- OperationId: `validate_sql_query_api_v1_datasets_custom_sql_validate_post`
- Tags: `Custom SQL Datasets`, `Custom SQL Datasets`
- Summary: Validate SQL Query
- Description: Validate SQL query for syntax, security, and permissions.          **Required Role**: Admin or Analyst          This endpoint checks:     - SQL syntax is valid     - Query is a SELECT statement (no DDL/DML)     - No dangerous operations (DROP, DELETE, etc.)     - User has access to referenced tables     - Tables exist in metadata          Returns validation status, referenced tables, errors, and warnings.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/CustomSQLQueryRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/CustomSQLDatasetValidation` | Validation completed (check 'valid' field for result) |
| `401` | `N/A` | N/A | Unauthorized |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/datasets/preview

- OperationId: `preview_dataset_api_v1_datasets_preview_post`
- Tags: `datasets`, `Datasets`
- Summary: Preview Dataset Data
- Description: Preview dataset data based on the provided definition.          This endpoint processes dataset definitions with table/column IDs and relationships,     reads data from parquet files, applies joins, and returns a preview of the result.          The preview executes the dataset query against the latest data and returns     a sample of the results along with schema information.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DatasetPreviewRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DatasetPreviewResponse` | Dataset preview generated successfully |
| `400` | `N/A` | N/A | Invalid dataset definition or references |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `422` | `N/A` | N/A | Request validation error |
| `500` | `N/A` | N/A | Error generating dataset preview |

---

### POST /api/v1/datasets/validate-dependencies

- OperationId: `validate_dataset_dependencies_api_v1_datasets_validate_dependencies_post`
- Tags: `datasets`, `Datasets`
- Summary: Validate Dataset Dependencies
- Description: Validate dataset dependencies (circular detection, status checks)

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DependencyValidationRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DependencyValidationResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/discovery/run/{data_source_id}/sync

- OperationId: `discover_metadata_sync_api_v1_discovery_run__data_source_id__sync_post`
- Tags: `discovery`
- Summary: Discover Metadata Sync
- Description: Discover metadata (tables and columns) from a data source and store in the metadata database. This is a synchronous operation that blocks until completion.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `data_source_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/entity-groups/

- OperationId: `list_entity_groups_api_v1_entity_groups__get`
- Tags: `entity-groups`
- Summary: List Entity Groups
- Description: List all entity groups for a specific entity type. **All authenticated users can view groups.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `entity_type` | `query` | Yes | ref: `#/components/schemas/EntityType` | Type of entity (dataset, report, question, dashboard) |
| `skip` | `query` | No | integer | Number of groups to skip for pagination |
| `limit` | `query` | No | integer | Number of groups to return |
| `search` | `query` | No | anyOf(string | null) | Search groups by name or description |
| `include_inactive` | `query` | No | boolean | Include inactive groups |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/EntityGroupListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/entity-groups/

- OperationId: `create_entity_group_api_v1_entity_groups__post`
- Tags: `entity-groups`
- Summary: Create Entity Group
- Description: Create a new entity group. **All authenticated users can create groups.**

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/EntityGroupCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/EntityGroupResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/entity-groups/{group_id}

- OperationId: `get_entity_group_api_v1_entity_groups__group_id__get`
- Tags: `entity-groups`
- Summary: Get Entity Group
- Description: Get a specific entity group by ID. **All authenticated users can view group details.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `group_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/EntityGroupResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/entity-groups/{group_id}

- OperationId: `update_entity_group_api_v1_entity_groups__group_id__put`
- Tags: `entity-groups`
- Summary: Update Entity Group
- Description: Update an entity group. **All authenticated users can update groups.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `group_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/EntityGroupUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/EntityGroupResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/entity-groups/{group_id}

- OperationId: `delete_entity_group_api_v1_entity_groups__group_id__delete`
- Tags: `entity-groups`
- Summary: Delete Entity Group
- Description: Delete an entity group (soft delete by default). **All authenticated users can delete groups.** - Set `hard_delete=true` to permanently delete the group and all memberships

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `group_id` | `path` | Yes | integer |  |
| `hard_delete` | `query` | No | boolean | Permanently delete the group |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/entity-groups/{group_id}/members

- OperationId: `get_group_members_api_v1_entity_groups__group_id__members_get`
- Tags: `entity-groups`
- Summary: Get Group Members
- Description: Get all entity IDs that are members of a group. **All authenticated users can view group members.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `group_id` | `path` | Yes | integer |  |
| `skip` | `query` | No | integer | Number of members to skip |
| `limit` | `query` | No | integer | Number of members to return |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/entity-groups/{group_id}/members

- OperationId: `add_group_members_api_v1_entity_groups__group_id__members_post`
- Tags: `entity-groups`
- Summary: Add Group Members
- Description: Add entities to a group. **All authenticated users can add members to groups.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `group_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/EntityGroupMemberAdd` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/EntityGroupMemberResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/entity-groups/{group_id}/members/{entity_id}

- OperationId: `remove_group_member_api_v1_entity_groups__group_id__members__entity_id__delete`
- Tags: `entity-groups`
- Summary: Remove Group Member
- Description: Remove an entity from a group. **All authenticated users can remove members from groups.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `group_id` | `path` | Yes | integer |  |
| `entity_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/entity-groups/{group_id}/members/remove

- OperationId: `remove_group_members_bulk_api_v1_entity_groups__group_id__members_remove_post`
- Tags: `entity-groups`
- Summary: Remove Group Members Bulk
- Description: Remove multiple entities from a group. **All authenticated users can remove members from groups.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `group_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/EntityGroupMemberRemove` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/EntityGroupMemberResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/entity-groups/entity/{entity_type}/{entity_id}/groups

- OperationId: `get_entity_groups_api_v1_entity_groups_entity__entity_type___entity_id__groups_get`
- Tags: `entity-groups`
- Summary: Get Entity Groups
- Description: Get all groups an entity belongs to. **All authenticated users can view entity groups.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `entity_type` | `path` | Yes | ref: `#/components/schemas/EntityType` |  |
| `entity_id` | `path` | Yes | integer |  |
| `include_inactive` | `query` | No | boolean | Include inactive groups |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/EntityGroupListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/entity-groups/entity/{entity_type}/{entity_id}/groups

- OperationId: `update_entity_groups_api_v1_entity_groups_entity__entity_type___entity_id__groups_put`
- Tags: `entity-groups`
- Summary: Update Entity Groups
- Description: Update groups for an entity (bulk replace). This replaces all current group memberships with the provided list. **All authenticated users can update entity groups.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `entity_type` | `path` | Yes | ref: `#/components/schemas/EntityType` |  |
| `entity_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/EntityGroupsUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/exports/{job_id}

- OperationId: `cancel_export_api_v1_exports__job_id__delete`
- Tags: `exports`
- Summary: Cancel Export Job
- Description: Cancel a queued or processing export job

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `job_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ExportCancelResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/exports/{job_id}/download

- OperationId: `download_export_api_v1_exports__job_id__download_get`
- Tags: `exports`
- Summary: Download Export File
- Description: Download the completed export file

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `job_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/exports/{job_id}/status

- OperationId: `get_export_status_api_v1_exports__job_id__status_get`
- Tags: `exports`
- Summary: Check Export Status
- Description: Get current status and progress of an export job

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `job_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ExportStatusResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/exports/history

- OperationId: `get_export_history_api_v1_exports_history_get`
- Tags: `exports`
- Summary: List Export History
- Description: Get list of user's recent export jobs

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `limit` | `query` | No | integer | Maximum results |
| `offset` | `query` | No | integer | Pagination offset |
| `status` | `query` | No | anyOf(string | null) | Filter by status |
| `report_id` | `query` | No | anyOf(integer | null) | Filter by report ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ExportHistoryResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/exports/rate-limit

- OperationId: `get_rate_limit_status_api_v1_exports_rate_limit_get`
- Tags: `exports`
- Summary: Get Rate Limit Info
- Description: Get current rate limit status for the user

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |

---

### GET /api/v1/feature-flags/

- OperationId: `get_feature_flags_api_v1_feature_flags__get`
- Tags: `feature-flags`
- Summary: Get Feature Flags
- Description: Get all feature flags.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `skip` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/FeatureFlag`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/feature-flags/

- OperationId: `create_feature_flag_api_v1_feature_flags__post`
- Tags: `feature-flags`
- Summary: Create Feature Flag
- Description: Create a new feature flag.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/FeatureFlagCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/FeatureFlag` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/feature-flags/{flag_name}

- OperationId: `get_feature_flag_api_v1_feature_flags__flag_name__get`
- Tags: `feature-flags`
- Summary: Get Feature Flag
- Description: Get a specific feature flag by name.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `flag_name` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/FeatureFlag` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/feature-flags/{flag_name}

- OperationId: `update_feature_flag_api_v1_feature_flags__flag_name__put`
- Tags: `feature-flags`
- Summary: Update Feature Flag
- Description: Update an existing feature flag.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `flag_name` | `path` | Yes | string |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/FeatureFlagUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/FeatureFlag` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/feature-flags/{flag_name}

- OperationId: `delete_feature_flag_api_v1_feature_flags__flag_name__delete`
- Tags: `feature-flags`
- Summary: Delete Feature Flag
- Description: Delete a feature flag.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `flag_name` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/feature-flags/check/{flag_name}

- OperationId: `check_feature_flag_api_v1_feature_flags_check__flag_name__get`
- Tags: `feature-flags`
- Summary: Check Feature Flag
- Description: Check if a feature flag is enabled for a specific user or globally.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `flag_name` | `path` | Yes | string |  |
| `user_id` | `query` | No | anyOf(integer | null) |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/feature-flags/user-flags

- OperationId: `get_user_feature_flags_api_v1_feature_flags_user_flags_get`
- Tags: `feature-flags`
- Summary: Get User Feature Flags
- Description: Get all feature flags for the current user from environment configuration. This endpoint returns flags from config/feature_flags.py (environment-based).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `user_id` | `query` | No | anyOf(integer | null) |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/files/{filename}

- OperationId: `delete_file_api_v1_files__filename__delete`
- Tags: `files`
- Summary: Delete File
- Description: Delete a file from the server.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `filename` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/files/download/{filename}

- OperationId: `download_file_api_v1_files_download__filename__get`
- Tags: `files`
- Summary: Download File
- Description: Download a file from the server.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `filename` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/files/list

- OperationId: `list_files_api_v1_files_list_get`
- Tags: `files`
- Summary: List Files
- Description: List all uploaded files. Optionally filter by file type.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `file_type` | `query` | No | anyOf(string | null) | Filter by file type (e.g., csv, xlsx) |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/FileListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/files/upload

- OperationId: `upload_file_api_v1_files_upload_post`
- Tags: `files`
- Summary: Upload File
- Description: Upload a file to the server. Supports the following file types: CSV, Excel, JSON, Parquet

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `multipart/form-data` | ref: `#/components/schemas/Body_upload_file_api_v1_files_upload_post` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/FileUploadResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/groups

- OperationId: `list_groups_api_v1_groups_get`
- Tags: `user-groups`
- Summary: List Groups
- Description: List all user groups. **All authenticated users can view groups.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `skip` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |
| `search` | `query` | No | anyOf(string | null) |  |
| `include_inactive` | `query` | No | boolean |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/GroupListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/groups

- OperationId: `create_group_api_v1_groups_post`
- Tags: `user-groups`
- Summary: Create Group
- Description: Create a new user group. **Admin only.**

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/GroupCreateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/GroupResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/groups/{group_id}

- OperationId: `get_group_api_v1_groups__group_id__get`
- Tags: `user-groups`
- Summary: Get Group
- Description: Get a specific group by ID. **All authenticated users can view group details.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `group_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/GroupResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/groups/{group_id}

- OperationId: `update_group_api_v1_groups__group_id__put`
- Tags: `user-groups`
- Summary: Update Group
- Description: Update a group. **Admin only.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `group_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/GroupUpdateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/GroupResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/groups/{group_id}

- OperationId: `delete_group_api_v1_groups__group_id__delete`
- Tags: `user-groups`
- Summary: Delete Group
- Description: Delete a group (soft delete by default). **Admin only.** - Set `hard_delete=true` to permanently delete the group

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `group_id` | `path` | Yes | integer |  |
| `hard_delete` | `query` | No | boolean |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/api__v1__endpoints__user_groups__MessageResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/groups/{group_id}/members

- OperationId: `get_group_members_api_v1_groups__group_id__members_get`
- Tags: `user-groups`
- Summary: Get Group Members
- Description: Get all members of a group. **All authenticated users can view group members.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `group_id` | `path` | Yes | integer |  |
| `skip` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/GroupMembersListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/groups/{group_id}/members

- OperationId: `add_group_members_api_v1_groups__group_id__members_post`
- Tags: `user-groups`
- Summary: Add Group Members
- Description: Add members to a group. **Admin only.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `group_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/GroupMemberAddRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/api__v1__endpoints__user_groups__MessageResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/groups/{group_id}/members/{user_id}

- OperationId: `remove_group_member_api_v1_groups__group_id__members__user_id__delete`
- Tags: `user-groups`
- Summary: Remove Group Member
- Description: Remove a member from a group. **Admin only.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `group_id` | `path` | Yes | integer |  |
| `user_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/api__v1__endpoints__user_groups__MessageResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/groups/me/groups

- OperationId: `get_my_groups_api_v1_groups_me_groups_get`
- Tags: `user-groups`
- Summary: Get My Groups
- Description: Get all groups the current user belongs to.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `include_inactive` | `query` | No | boolean |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/GroupListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/groups/user/{user_id}/groups

- OperationId: `get_user_groups_api_v1_groups_user__user_id__groups_get`
- Tags: `user-groups`
- Summary: Get User Groups
- Description: Get all groups a user belongs to. **All authenticated users can view their own groups. Admins can view any user's groups.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `user_id` | `path` | Yes | integer |  |
| `include_inactive` | `query` | No | boolean |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/GroupListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/health/

- OperationId: `health_check_api_v1_health__get`
- Tags: `health`
- Summary: Health Check
- Description: Basic health check endpoint.

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/api__v1__endpoints__health__HealthResponse` | Successful Response |

---

### GET /api/v1/health/detailed

- OperationId: `detailed_health_check_api_v1_health_detailed_get`
- Tags: `health`
- Summary: Detailed Health Check
- Description: Detailed health check with system information.

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DetailedHealthResponse` | Successful Response |

---

### GET /api/v1/health/live

- OperationId: `liveness_check_api_v1_health_live_get`
- Tags: `health`
- Summary: Liveness Check
- Description: Kubernetes-style liveness probe.

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |

---

### GET /api/v1/health/ready

- OperationId: `readiness_check_api_v1_health_ready_get`
- Tags: `health`
- Summary: Readiness Check
- Description: Kubernetes-style readiness probe.

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |

---

### GET /api/v1/parameters/

- OperationId: `list_parameters_api_v1_parameters__get`
- Tags: `parameters`
- Summary: List Parameters
- Description: List parameters with filters. - **scope**: Filter by scope (global/datasource) - **datasource_id**: Filter by datasource ID - **category**: Filter by category - **search**: Search in name, display_name, description - **is_active**: Filter by active status - **offset**: Pagination offset - **limit**: Pagination limit

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `scope` | `query` | No | anyOf(string | null) |  |
| `datasource_id` | `query` | No | anyOf(integer | null) |  |
| `category` | `query` | No | anyOf(string | null) |  |
| `search` | `query` | No | anyOf(string | null) |  |
| `is_active` | `query` | No | anyOf(boolean | null) |  |
| `offset` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ParameterListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/parameters/

- OperationId: `create_parameter_api_v1_parameters__post`
- Tags: `parameters`
- Summary: Create Parameter
- Description: Create a new parameter. - **name**: Unique parameter name (snake_case) - **display_name**: Human-readable name - **scope**: global or datasource - **datasource_id**: Required if scope=datasource - **data_type**: string, integer, decimal, boolean, date, datetime, list - **default_value**: Default value (optional) - **validation_rules**: Validation constraints (optional)

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ParameterCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/Parameter` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/parameters/{parameter_id}

- OperationId: `get_parameter_api_v1_parameters__parameter_id__get`
- Tags: `parameters`
- Summary: Get Parameter
- Description: Get parameter by ID.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `parameter_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/Parameter` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/parameters/{parameter_id}

- OperationId: `update_parameter_api_v1_parameters__parameter_id__put`
- Tags: `parameters`
- Summary: Update Parameter
- Description: Update parameter. Note: Cannot update name, scope, datasource_id, or data_type.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `parameter_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ParameterUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/Parameter` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/parameters/{parameter_id}

- OperationId: `delete_parameter_api_v1_parameters__parameter_id__delete`
- Tags: `parameters`
- Summary: Delete Parameter
- Description: Delete parameter. - **force**: If true, delete even if parameter is in use

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `parameter_id` | `path` | Yes | integer |  |
| `force` | `query` | No | boolean | Force delete even if parameter is in use |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/parameters/{parameter_id}/usages

- OperationId: `get_parameter_usages_api_v1_parameters__parameter_id__usages_get`
- Tags: `parameters`
- Summary: Get Parameter Usages
- Description: Get parameter with usage information. Returns the parameter along with all locations where it's used.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `parameter_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ParameterWithUsage` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/parameters/{parameter_id}/validate

- OperationId: `validate_parameter_value_api_v1_parameters__parameter_id__validate_post`
- Tags: `parameters`
- Summary: Validate Parameter Value
- Description: Validate a value against parameter constraints. Checks: - Data type compatibility - Validation rules (min/max, regex, allowed values, etc.) Returns validation result with converted value if valid.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `parameter_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ParameterValidateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ParameterValidateResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/parameters/datasource/{datasource_id}

- OperationId: `list_datasource_parameters_api_v1_parameters_datasource__datasource_id__get`
- Tags: `parameters`
- Summary: List Datasource Parameters
- Description: List parameters for a specific datasource. Returns both global parameters and datasource-specific parameters.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `datasource_id` | `path` | Yes | integer |  |
| `category` | `query` | No | anyOf(string | null) |  |
| `search` | `query` | No | anyOf(string | null) |  |
| `is_active` | `query` | No | anyOf(boolean | null) |  |
| `offset` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ParameterListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/parameters/global

- OperationId: `list_global_parameters_api_v1_parameters_global_get`
- Tags: `parameters`
- Summary: List Global Parameters
- Description: List global parameters only. Convenience endpoint for fetching global parameters.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `category` | `query` | No | anyOf(string | null) |  |
| `search` | `query` | No | anyOf(string | null) |  |
| `is_active` | `query` | No | anyOf(boolean | null) |  |
| `offset` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ParameterListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/parameters/replace

- OperationId: `replace_parameters_api_v1_parameters_replace_post`
- Tags: `parameters`
- Summary: Replace Parameters
- Description: Replace parameter references in an expression with their values. Supports: - {{param:name}} - Global parameter - {{param:datasource_id.name}} - Datasource parameter Example: ``` Input: "SELECT * FROM orders WHERE year = {{param:current_year}}" Output: "SELECT * FROM orders WHERE year = 2025" ```

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ParameterReplaceRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ParameterReplaceResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/parameters/runtime-value

- OperationId: `set_runtime_value_api_v1_parameters_runtime_value_post`
- Tags: `parameters`
- Summary: Set Runtime Value
- Description: Set runtime value for a parameter. Runtime values override default values for specific contexts: - User-level: Default for this user - Context-level: For specific dashboard, report, or question

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ParameterRuntimeValueCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/ParameterRuntimeValue` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/parameters/runtime-value/{runtime_value_id}

- OperationId: `delete_runtime_value_api_v1_parameters_runtime_value__runtime_value_id__delete`
- Tags: `parameters`
- Summary: Delete Runtime Value
- Description: Delete a runtime value.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `runtime_value_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/parameters/runtime-values

- OperationId: `get_runtime_values_api_v1_parameters_runtime_values_get`
- Tags: `parameters`
- Summary: Get Runtime Values
- Description: Get runtime values for current user. - **context_type**: Filter by context type (dashboard, report, question) - **context_id**: Filter by specific context ID

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `context_type` | `query` | No | anyOf(string | null) |  |
| `context_id` | `query` | No | anyOf(string | null) |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/ParameterRuntimeValue`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/query/query/join-path

- OperationId: `find_join_path_api_v1_query_query_join_path_post`
- Tags: `query`
- Summary: Find join path
- Description: Find and return a join path between a source and target table.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/JoinPathRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/JoinPathResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/query/tables/{table_id}/related-tables

- OperationId: `get_related_tables_api_v1_query_tables__table_id__related_tables_get`
- Tags: `query`
- Summary: Get related tables
- Description: List tables that are directly related to the given table via an active relationship.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer | The ID of the table |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<object> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/questions-v2/

- OperationId: `list_questions_v2_api_v1_questions_v2__get`
- Tags: `questions-v2`, `Questions V2`
- Summary: List Questions (v2 Format)
- Description: Get a list of all questions in V2 format with filtering and pagination.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `skip` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |
| `category_id` | `query` | No | anyOf(integer | null) |  |
| `status` | `query` | No | anyOf(string | null) |  |
| `search` | `query` | No | anyOf(string | null) |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/questions-v2/

- OperationId: `create_question_v2_api_v1_questions_v2__post`
- Tags: `questions-v2`, `Questions V2`
- Summary: Create Question (v2 Format)
- Description: Create a new question using the simplified v2 format.          This endpoint accepts the new simplified question definition format     and automatically converts it to the legacy format for storage,     ensuring backward compatibility while providing a modern API.          Phase 3: Validates derived measures if present.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/QuestionV2CreateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/QuestionV2Response` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/questions-v2/{question_id}

- OperationId: `get_question_v2_api_v1_questions_v2__question_id__get`
- Tags: `questions-v2`, `Questions V2`
- Summary: Get Question (v2 Format)
- Description: Retrieve a question in the simplified v2 format.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `question_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/QuestionV2Response` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/questions-v2/{question_id}

- OperationId: `update_question_v2_api_v1_questions_v2__question_id__put`
- Tags: `questions-v2`, `Questions V2`
- Summary: Update Question (v2 Format)
- Description: Update an existing question using the simplified v2 format.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `question_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/QuestionV2UpdateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/QuestionV2Response` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/questions-v2/{question_id}

- OperationId: `delete_question_v2_api_v1_questions_v2__question_id__delete`
- Tags: `questions-v2`, `Questions V2`
- Summary: Delete Question
- Description: Delete a question by ID.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `question_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/questions-v2/{question_id}/data

- OperationId: `get_question_data_v2_api_v1_questions_v2__question_id__data_get`
- Tags: `questions-v2`, `Questions V2`
- Summary: Get Question Data (v2 Format)
- Description: Get data for a saved question using v2 format.          This endpoint reads from materialized parquet files (partitioned or single file)     and returns the aggregated data ready for chart rendering with configurations applied.          Applies limit_config, sort_configs, and value_range_filters from question configuration.          Runtime Filters (user interactions):     - drill_filters: For drill-down navigation [{column: string, value: any}]     - runtime_filters: For dashboard/question view filters [{column: string, operator: string, value: any}]          Supported operators for runtime_filters:     - equals, not_equals, greater_than, less_than, greater_than_or_equal, less_than_or_equal     - contains, not_contains, starts_with, ends_with     - in, not_in (value should be array)     - is_null, is_not_null (no value needed)     - between (value should be [min, max])

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `question_id` | `path` | Yes | integer |  |
| `page` | `query` | No | integer |  |
| `page_size` | `query` | No | integer |  |
| `level` | `query` | No | anyOf(integer | null) | Aggregation level (0=grand total, 1=level 1, etc.) |
| `drill_filters` | `query` | No | anyOf(string | null) | JSON array of drill filters: [{column: string, value: any}] |
| `runtime_filters` | `query` | No | anyOf(string | null) | JSON array of runtime filters: [{column: string, operator: string, value: any}] |
| `runtime_granularity` | `query` | No | anyOf(string | null) | Override date granularity at runtime: auto\|year\|quarter\|month\|week\|day\|hour\|minute |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/questions-v2/{question_id}/duplicate

- OperationId: `duplicate_question_v2_api_v1_questions_v2__question_id__duplicate_post`
- Tags: `questions-v2`, `Questions V2`
- Summary: Duplicate Question
- Description: Create a copy of an existing question.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `question_id` | `path` | Yes | integer |  |
| `new_name` | `query` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/QuestionV2Response` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/questions-v2/{question_id}/materialize

- OperationId: `materialize_question_api_v1_questions_v2__question_id__materialize_post`
- Tags: `questions-v2`, `Questions V2`
- Summary: Materialize Question Data
- Description: Trigger materialization for a specific question.          This creates pre-aggregated multi-level data for fast chart rendering.     Materialization applies base filters and aggregation rules, storing the result     in optimized Parquet format.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `question_id` | `path` | Yes | integer |  |
| `force_refresh` | `query` | No | boolean | Force refresh even if already materialized |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/questions-v2/categories

- OperationId: `get_categories_v2_api_v1_questions_v2_categories_get`
- Tags: `questions-v2`, `Questions V2`
- Summary: Get Question Categories
- Description: Get all question categories.

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |

---

### POST /api/v1/questions-v2/categories

- OperationId: `create_category_v2_api_v1_questions_v2_categories_post`
- Tags: `questions-v2`, `Questions V2`
- Summary: Create Question Category
- Description: Create a new question category.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `name` | `query` | Yes | string |  |
| `description` | `query` | No | anyOf(string | null) |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/questions-v2/categories/{category_id}

- OperationId: `update_category_v2_api_v1_questions_v2_categories__category_id__put`
- Tags: `questions-v2`, `Questions V2`
- Summary: Update Question Category
- Description: Update an existing question category.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `category_id` | `path` | Yes | integer |  |
| `name` | `query` | No | anyOf(string | null) |  |
| `description` | `query` | No | anyOf(string | null) |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/questions-v2/categories/{category_id}

- OperationId: `delete_category_v2_api_v1_questions_v2_categories__category_id__delete`
- Tags: `questions-v2`, `Questions V2`
- Summary: Delete Question Category
- Description: Delete a question category.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `category_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/questions-v2/chart-types

- OperationId: `get_chart_types_v2_api_v1_questions_v2_chart_types_get`
- Tags: `questions-v2`, `Questions V2`
- Summary: Get Chart Types
- Description: Get all available chart types.

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |

---

### POST /api/v1/questions-v2/convert/v1-to-v2/{question_id}

- OperationId: `convert_question_to_v2_api_v1_questions_v2_convert_v1_to_v2__question_id__post`
- Tags: `questions-v2`, `Questions V2`
- Summary: Convert Question from v1 to v2 Format
- Description: Convert an existing v1 question to v2 format for editing in the new wizard.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `question_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/QuestionV2Response` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/questions-v2/health

- OperationId: `health_check_api_v1_questions_v2_health_get`
- Tags: `questions-v2`, `Questions V2`
- Summary: V2 API Health Check
- Description: Check if the v2 API is working correctly.

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |

---

### POST /api/v1/questions-v2/preview

- OperationId: `preview_question_v2_api_v1_questions_v2_preview_post`
- Tags: `questions-v2`, `Questions V2`
- Summary: Preview Question Data (v2 Format)
- Description: Preview question data using the simplified v2 format.          This endpoint accepts v2 question definitions and returns chart data     without creating a persistent question. Perfect for the wizard preview step.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/QuestionV2PreviewRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/QuestionV2PreviewResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/questions-v2/validate-measures

- OperationId: `validate_derived_measures_api_v1_questions_v2_validate_measures_post`
- Tags: `questions-v2`, `Questions V2`
- Summary: Validate Derived Measures
- Description: Validate derived measures configuration without creating a question.          Phase 3: Pre-flight validation for derived measures.          Returns validation result with:     - valid: boolean indicating if all measures are valid     - errors: list of error messages     - warnings: list of warning messages     - issues: detailed list of validation issues with codes and suggestions

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/QuestionV2PreviewRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/questions/

- OperationId: `get_questions_api_v1_questions__get`
- Tags: `questions`
- Summary: Get Questions
- Description: Get questions with filtering and pagination.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `skip` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |
| `category_id` | `query` | No | anyOf(integer | null) |  |
| `question_status` | `query` | No | anyOf(ref: `#/components/schemas/QuestionStatus` | null) |  |
| `search` | `query` | No | anyOf(string | null) |  |
| `groups` | `query` | No | anyOf(string | null) | Comma-separated group IDs to filter by |
| `group_filter_mode` | `query` | No | anyOf(string | null) | 'any' (OR) or 'all' (AND) for group filtering |
| `include_ungrouped` | `query` | No | boolean | Include questions without any groups |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/QuestionListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/questions/{question_id}

- OperationId: `get_question_api_v1_questions__question_id__get`
- Tags: `questions`
- Summary: Get Question
- Description: Get a question by ID.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `question_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/QuestionResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/questions/{question_id}

- OperationId: `delete_question_api_v1_questions__question_id__delete`
- Tags: `questions`
- Summary: Delete Question
- Description: Delete a question.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `question_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/questions/{question_id}/data

- OperationId: `get_question_data_api_v1_questions__question_id__data_post`
- Tags: `questions`
- Summary: Get Question Data
- Description: Get question data with pagination. This endpoint intelligently handles both materialized and non-materialized questions: - If question is materialized, returns data from the parquet file - If not materialized, generates data on-the-fly from source data

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `question_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/QuestionDataRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/QuestionDataResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/questions/{question_id}/drill-down

- OperationId: `get_drill_down_data_api_v1_questions__question_id__drill_down_get`
- Tags: `questions`
- Summary: Get Drill Down Data
- Description: Get drill-down data for a question.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `question_id` | `path` | Yes | integer |  |
| `drill_path` | `query` | No | string | Comma-separated drill path values |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/questions/{question_id}/duplicate

- OperationId: `duplicate_question_api_v1_questions__question_id__duplicate_post`
- Tags: `questions`
- Summary: Duplicate Question
- Description: Duplicate a question.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `question_id` | `path` | Yes | integer |  |
| `new_name` | `query` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/QuestionResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/questions/{question_id}/tooltip-data

- OperationId: `get_tooltip_data_api_v1_questions__question_id__tooltip_data_post`
- Tags: `questions`
- Summary: Get Tooltip Data
- Description: Get enhanced tooltip data for a specific data point.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `question_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | object |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/questions/categories

- OperationId: `get_question_categories_api_v1_questions_categories_get`
- Tags: `questions`
- Summary: Get Question Categories
- Description: Get all question categories.

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |

---

### POST /api/v1/questions/categories

- OperationId: `create_question_category_api_v1_questions_categories_post`
- Tags: `questions`
- Summary: Create Question Category
- Description: Create a new question category.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/QuestionCategoryCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/questions/categories/{category_id}

- OperationId: `update_question_category_api_v1_questions_categories__category_id__put`
- Tags: `questions`
- Summary: Update Question Category
- Description: Update a question category.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `category_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/QuestionCategoryUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/questions/categories/{category_id}

- OperationId: `delete_question_category_api_v1_questions_categories__category_id__delete`
- Tags: `questions`
- Summary: Delete Question Category
- Description: Delete a question category.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `category_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/questions/chart-types

- OperationId: `get_chart_types_api_v1_questions_chart_types_get`
- Tags: `questions`
- Summary: Get Chart Types
- Description: Get available chart types.

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ChartTypesResponse` | Successful Response |

---

### GET /api/v1/relationships

- OperationId: `list_relationships_api_v1_relationships_get`
- Tags: `relationships`
- Summary: List all relationships
- Description: Get a list of all table relationships with optional filtering and pagination.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `skip` | `query` | No | integer | Number of items to skip |
| `limit` | `query` | No | integer | Number of items to return |
| `source_table_id` | `query` | No | anyOf(integer | null) | Filter by source table ID |
| `target_table_id` | `query` | No | anyOf(integer | null) | Filter by target table ID |
| `relationship_type` | `query` | No | anyOf(string | null) | Filter by relationship type |
| `is_active` | `query` | No | anyOf(boolean | null) | Filter by active status |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/RelationshipListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/relationships

- OperationId: `create_relationship_api_v1_relationships_post`
- Tags: `relationships`
- Summary: Create a new relationship
- Description: Create a new table relationship with initial column mappings.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/RelationshipCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/RelationshipResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/relationships/{relationship_id}

- OperationId: `get_relationship_api_v1_relationships__relationship_id__get`
- Tags: `relationships`
- Summary: Get relationship details
- Description: Get details of a specific table relationship, including its column mappings.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `relationship_id` | `path` | Yes | integer | The ID of the relationship to retrieve |
| `perspective_table_id` | `query` | No | anyOf(integer | null) | Optional table ID to view the relationship from. If provided, the relationship will be returned from this table's perspective. |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/RelationshipResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/relationships/{relationship_id}

- OperationId: `update_relationship_api_v1_relationships__relationship_id__put`
- Tags: `relationships`
- Summary: Update relationship
- Description: Update relationship details and optionally update column mappings.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `relationship_id` | `path` | Yes | integer | The ID of the relationship to update |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/RelationshipUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/RelationshipResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/relationships/{relationship_id}

- OperationId: `delete_relationship_api_v1_relationships__relationship_id__delete`
- Tags: `relationships`
- Summary: Delete relationship
- Description: Delete a specific table relationship and all its associated column mappings.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `relationship_id` | `path` | Yes | integer | The ID of the relationship to delete |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/relationships/{relationship_id}/column-mappings

- OperationId: `list_column_mappings_api_v1_relationships__relationship_id__column_mappings_get`
- Tags: `relationships`
- Summary: List column mappings
- Description: Get all column mappings for a specific relationship.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `relationship_id` | `path` | Yes | integer | The ID of the relationship |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/RelationshipColumnMappingResponse`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/relationships/tables/{table_id}/relationships

- OperationId: `get_table_relationships_api_v1_relationships_tables__table_id__relationships_get`
- Tags: `relationships`
- Summary: Get table relationships
- Description: Get all relationships where the given table is either a source or a target.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer | The ID of the table |
| `skip` | `query` | No | integer | Number of items to skip |
| `limit` | `query` | No | integer | Number of items to return |
| `is_active` | `query` | No | anyOf(boolean | null) | Filter by active status |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/RelationshipResponse`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/reports/

- OperationId: `list_reports_api_v1_reports__get`
- Tags: `reports`, `Reports`
- Summary: List Reports
- Description: Retrieve a paginated list of reports with optional filtering. For admin/analyst, includes virtual reports in a separate array. For viewers, virtual reports are mixed into the main list.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `skip` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |
| `status` | `query` | No | anyOf(string | null) |  |
| `category_id` | `query` | No | anyOf(integer | null) |  |
| `search` | `query` | No | anyOf(string | null) |  |
| `groups` | `query` | No | anyOf(string | null) |  |
| `group_filter_mode` | `query` | No | anyOf(string | null) |  |
| `include_ungrouped` | `query` | No | boolean |  |
| `include_virtual` | `query` | No | boolean |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | List of report objects with optional virtual reports |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/reports/

- OperationId: `create_report_api_v1_reports__post`
- Tags: `reports`, `Reports`
- Summary: Create Report
- Description: Create a new report with the provided configuration.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ReportCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/ReportResponse` | Report created successfully |
| `400` | `N/A` | N/A | Invalid input data |
| `401` | `N/A` | N/A | Unauthorized |
| `409` | `N/A` | N/A | Report with this name already exists |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/reports/{report_id}

- OperationId: `get_report_api_v1_reports__report_id__get`
- Tags: `reports`, `Reports`
- Summary: Get Report by ID
- Description: Retrieve a report by its unique identifier.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report to retrieve |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ReportResponse` | Report found and returned |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Report not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/reports/{report_id}

- OperationId: `update_report_api_v1_reports__report_id__put`
- Tags: `reports`, `Reports`
- Summary: Update Report
- Description: Update an existing report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report to update |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ReportUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ReportResponse` | Report updated successfully |
| `400` | `N/A` | N/A | Invalid input data |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Report not found |
| `409` | `N/A` | N/A | Report with this name already exists |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### DELETE /api/v1/reports/{report_id}

- OperationId: `delete_report_api_v1_reports__report_id__delete`
- Tags: `reports`, `Reports`
- Summary: Delete Report
- Description: Delete an existing report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report to delete |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Report deleted successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Report not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/reports/{report_id}/access

- OperationId: `list_report_access_api_v1_reports__report_id__access_get`
- Tags: `reports`, `Report Access`
- Summary: List Report Access
- Description: List all users with access to a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/ReportAccessResponse`> | Access list retrieved successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Report not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/reports/{report_id}/access/{user_id}

- OperationId: `grant_access_api_v1_reports__report_id__access__user_id__post`
- Tags: `reports`, `Report Access`
- Summary: Grant Report Access
- Description: Grant a user access to a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report |
| `user_id` | `path` | Yes | integer | The ID of the user to grant access to |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Access granted successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Report or user not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### DELETE /api/v1/reports/{report_id}/access/{user_id}

- OperationId: `revoke_access_api_v1_reports__report_id__access__user_id__delete`
- Tags: `reports`, `Report Access`
- Summary: Revoke Report Access
- Description: Revoke a user's access to a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report |
| `user_id` | `path` | Yes | integer | The ID of the user to revoke access from |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Access revoked successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Report or user not found, or no access to revoke |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/reports/{report_id}/columns/{column_name}/unique-values

- OperationId: `get_unique_column_values_api_v1_reports__report_id__columns__column_name__unique_values_get`
- Tags: `Reports - Query`, `Reports - Query`
- Summary: Get Unique Column Values
- Description: Get unique values for a specific column from materialized report data.          ## Features:     - **Searchable**: Filter values by search term (case-insensitive)     - **Paginated**: Limit results to prevent large responses     - **Sorted**: Values returned in alphabetical order     - **Fast**: Queries directly from parquet file using DuckDB          ## Use Cases:     - Populate filter dropdowns with available values     - Auto-complete suggestions     - Data exploration and validation          ## Performance:     - Typical response time: < 100ms for most columns     - Handles millions of rows efficiently     - Results are cached by DuckDB

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report |
| `column_name` | `path` | Yes | string | The name of the column |
| `limit` | `query` | No | integer | Maximum number of values to return |
| `search` | `query` | No | anyOf(string | null) | Search term to filter values (case-insensitive) |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/api__v1__endpoints__reports_query__UniqueValuesResponse` | Unique values retrieved successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `404` | `N/A` | N/A | Report or column not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/reports/{report_id}/drill-level

- OperationId: `get_drill_level_api_v1_reports__report_id__drill_level_get`
- Tags: `reports`
- Summary: Query Specific Drill Level
- Description: Query a specific drill level with optional drill path filtering for drill-down reports. Enables progressive drill-down navigation by loading data one level at a time.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report |
| `level` | `query` | No | integer | Drill level to query (0 = grand total, N = detail level) |
| `drill_path` | `query` | No | anyOf(string | null) | JSON-encoded drill path filters, e.g., [{"column":"Region","value":"West"}] |
| `runtime_filters` | `query` | No | anyOf(string | null) | JSON-encoded runtime filters, e.g., [{"field":"Sales","operator":">","value":1000}] |
| `sorting` | `query` | No | anyOf(string | null) | JSON-encoded sorting configuration, e.g., [{"field":"Sales","direction":"desc"}] |
| `page` | `query` | No | integer | Page number (1-indexed) |
| `page_size` | `query` | No | integer | Number of rows per page (default 50, max 200 for performance) |
| `report_context` | `query` | No | anyOf(string | null) | JSON-encoded report context for Phase 4/5 measures, e.g., {"measures": [...], "quick_measures": [...]} |
| `visible_measures` | `query` | No | anyOf(string | null) | JSON-encoded list of measure column names to include (Phase 2), e.g., ["Sales","Qty"] |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DrillLevelResponse` | Drill level data with navigation metadata |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/reports/{report_id}/drill-level

- OperationId: `post_drill_level_api_v1_reports__report_id__drill_level_post`
- Tags: `reports`
- Summary: Query Specific Drill Level (POST)
- Description: Query a specific drill level with optional drill path filtering for drill-down reports. Uses POST to handle large payloads (complex filters, deep drill paths).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/DrillLevelRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DrillLevelResponse` | Drill level data with navigation metadata |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/reports/{report_id}/duplicate

- OperationId: `duplicate_report_api_v1_reports__report_id__duplicate_post`
- Tags: `reports`, `Reports`
- Summary: Duplicate Report
- Description: Create a duplicate of an existing report with a new name and optional viewer state.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report to duplicate |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ReportDuplicateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/ReportResponse` | Report duplicated successfully |
| `400` | `N/A` | N/A | Invalid input data |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Report not found |
| `409` | `N/A` | N/A | Report with this name already exists |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/reports/{report_id}/effective-measures

- OperationId: `get_effective_measures_api_v1_reports__report_id__effective_measures_get`
- Tags: `runtime-measures`
- Summary: Get effective measures
- Description: Get all effective measures for a report view with tier precedence applied.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer |  |
| `virtual_report_id` | `query` | No | anyOf(integer | null) | Virtual report ID if viewing VR |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/EffectiveMeasuresResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/reports/{report_id}/export

- OperationId: `initiate_export_api_v1_reports__report_id__export_post`
- Tags: `exports`
- Summary: Initiate Report Export
- Description: Create an export job and queue it for background processing

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ExportInitRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/ExportInitResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/reports/{report_id}/export/preview

- OperationId: `preview_export_api_v1_reports__report_id__export_preview_post`
- Tags: `exports`
- Summary: Preview Export
- Description: Get export estimates without creating a job

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ExportPreviewRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ExportPreviewResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/reports/{report_id}/grand-totals

- OperationId: `get_report_grand_totals_api_v1_reports__report_id__grand_totals_get`
- Tags: `reports`
- Summary: Get Grand Totals for Report
- Description: Calculate grand totals for measure columns, optionally with runtime filters applied.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report |
| `runtime_filters` | `query` | No | anyOf(string | null) | JSON-encoded runtime filters, e.g., [{"field":"Region","operator":"equals","value":"West"}] |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ReportGrandTotalsResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/reports/{report_id}/materialization-status/{task_id}

- OperationId: `get_materialization_status_api_v1_reports__report_id__materialization_status__task_id__get`
- Tags: `reports`, `Reports`
- Summary: Get Materialization Status
- Description: Get the status of a materialization task by task ID. Use this to poll for completion after calling POST /{report_id}/materialize.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report |
| `task_id` | `path` | Yes | string | The task ID returned from materialize endpoint |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/MaterializationStatusResponse` | Task status retrieved successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `404` | `N/A` | N/A | Report not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/reports/{report_id}/materialize

- OperationId: `materialize_report_api_v1_reports__report_id__materialize_post`
- Tags: `reports`, `Reports`
- Summary: Materialize Report
- Description: Materialize a report synchronously. Scheduled materializations are handled by the APScheduler service.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report to materialize |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ReportMaterializeResponse` | Materialization queued or completed successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Report not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/reports/{report_id}/measures

- OperationId: `list_report_measures_api_v1_reports__report_id__measures_get`
- Tags: `runtime-measures`
- Summary: List report measures
- Description: Get all runtime measures defined on a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ReportMeasuresListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/reports/{report_id}/measures

- OperationId: `add_report_measure_api_v1_reports__report_id__measures_post`
- Tags: `runtime-measures`
- Summary: Add report measure
- Description: Add a new runtime measure to a report. Requires admin or analyst role for certain measure types.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/RuntimeMeasureCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/RuntimeMeasureResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/reports/{report_id}/measures/{measure_id}

- OperationId: `update_report_measure_api_v1_reports__report_id__measures__measure_id__put`
- Tags: `runtime-measures`
- Summary: Update report measure
- Description: Update an existing runtime measure on a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer |  |
| `measure_id` | `path` | Yes | string |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/RuntimeMeasureUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/RuntimeMeasureResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/reports/{report_id}/measures/{measure_id}

- OperationId: `delete_report_measure_api_v1_reports__report_id__measures__measure_id__delete`
- Tags: `runtime-measures`
- Summary: Delete report measure
- Description: Delete a runtime measure from a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer |  |
| `measure_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/reports/{report_id}/measures/validate

- OperationId: `validate_runtime_measure_api_v1_reports__report_id__measures_validate_post`
- Tags: `runtime-measures`
- Summary: Validate a runtime measure configuration
- Description: Validates a runtime measure configuration against report context without creating it. Phase 6: Pre-query validation enhancement.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer |  |
| `virtual_report_id` | `query` | No | anyOf(integer | null) | Virtual report ID if applicable |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/RuntimeMeasureValidateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/RuntimeMeasureValidateResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/reports/{report_id}/query

- OperationId: `query_report_api_v1_reports__report_id__query_post`
- Tags: `Reports - Query`, `Reports - Runtime Query`
- Summary: Query Report with Runtime Filters and Re-Aggregation
- Description: Query materialized report with runtime filters and dynamic re-aggregation support.          ## Key Features:     - **Runtime Filtering**: Apply filters on any column, including hidden ones     - **Dynamic Re-Aggregation**: Automatically re-aggregate measures when dimensions are hidden     - **Pagination**: Efficient pagination support     - **Sorting**: Custom sorting on any column          ## Re-Aggregation Example:     If a report has columns: Region | Country | City | Sales     And user hides the City column at runtime,     The service will automatically re-aggregate Sales at Region+Country level.          ## Report Type Optimizations:     - **Flat Reports**: Re-aggregates when dimensions hidden     - **Hierarchical Reports**: Queries pre-aggregated level (no re-aggregation needed!)     - **Pivot Reports**: Simple column filtering     - **Summary Reports**: Returns single row

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report to query |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/RuntimeQueryRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/RuntimeQueryResponse` | Query executed successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Report not found or not materialized |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/reports/{report_id}/saved-filters

- OperationId: `list_saved_filters_api_v1_reports__report_id__saved_filters_get`
- Tags: `saved-filters`, `Reports - Saved Filters`
- Summary: List Saved Filters for Report
- Description: Get all saved filters for a report that the current user can access (own filters + shared filters).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |
| `include_shared` | `query` | No | boolean | Include shared filters from other users |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SavedFiltersListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/reports/{report_id}/saved-filters

- OperationId: `create_saved_filter_api_v1_reports__report_id__saved_filters_post`
- Tags: `saved-filters`, `Reports - Saved Filters`
- Summary: Create Saved Filter
- Description: Save a new filter configuration for a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/SavedFilterCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/SavedFilterResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/reports/{report_id}/saved-filters/{filter_id}

- OperationId: `get_saved_filter_api_v1_reports__report_id__saved_filters__filter_id__get`
- Tags: `saved-filters`, `Reports - Saved Filters`
- Summary: Get Saved Filter
- Description: Get a specific saved filter by ID.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |
| `filter_id` | `path` | Yes | integer | Saved filter ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SavedFilterResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/reports/{report_id}/saved-filters/{filter_id}

- OperationId: `update_saved_filter_api_v1_reports__report_id__saved_filters__filter_id__put`
- Tags: `saved-filters`, `Reports - Saved Filters`
- Summary: Update Saved Filter
- Description: Update an existing saved filter. Only the owner can update.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |
| `filter_id` | `path` | Yes | integer | Saved filter ID |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/SavedFilterUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SavedFilterResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/reports/{report_id}/saved-filters/{filter_id}

- OperationId: `delete_saved_filter_api_v1_reports__report_id__saved_filters__filter_id__delete`
- Tags: `saved-filters`, `Reports - Saved Filters`
- Summary: Delete Saved Filter
- Description: Delete a saved filter. Only the owner can delete.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |
| `filter_id` | `path` | Yes | integer | Saved filter ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/reports/{report_id}/saved-filters/default

- OperationId: `get_default_saved_filter_api_v1_reports__report_id__saved_filters_default_get`
- Tags: `saved-filters`, `Reports - Saved Filters`
- Summary: Get Default Saved Filter
- Description: Get the default saved filter for a report (user's own default or shared default). Returns null if no default filter exists.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | anyOf(ref: `#/components/schemas/SavedFilterResponse` | null) | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/reports/{report_id}/schedule

- OperationId: `get_schedule_api_v1_reports__report_id__schedule_get`
- Tags: `reports`, `Report Schedules`
- Summary: Get Report Schedule
- Description: Get the schedule for a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ReportScheduleResponse` | Schedule retrieved successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Report or schedule not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/reports/{report_id}/schedule

- OperationId: `create_schedule_api_v1_reports__report_id__schedule_post`
- Tags: `reports`, `Report Schedules`
- Summary: Create Report Schedule
- Description: Create a schedule for report materialization.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | The ID of the report |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ReportScheduleCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/ReportScheduleResponse` | Schedule created successfully |
| `400` | `N/A` | N/A | Invalid input data |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Report not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### GET /api/v1/reports/{report_id}/user-measures

- OperationId: `get_user_measures_for_report_api_v1_reports__report_id__user_measures_get`
- Tags: `runtime-measures`
- Summary: Get user measures for report
- Description: Get current user's personal measures for a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/UserMeasuresResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/reports/{report_id}/user-measures

- OperationId: `add_user_measure_for_report_api_v1_reports__report_id__user_measures_post`
- Tags: `runtime-measures`
- Summary: Add user measure for report
- Description: Add a single user measure for a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/RuntimeMeasureCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/RuntimeMeasureResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/reports/{report_id}/user-measures

- OperationId: `save_user_measures_for_report_api_v1_reports__report_id__user_measures_put`
- Tags: `runtime-measures`
- Summary: Save user measures for report
- Description: Save (replace) user's personal measures for a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/UserMeasuresSaveRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/UserMeasuresResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PATCH /api/v1/reports/{report_id}/user-measures/{measure_id}

- OperationId: `update_user_measure_for_report_api_v1_reports__report_id__user_measures__measure_id__patch`
- Tags: `runtime-measures`
- Summary: Update user measure for report
- Description: Update a user measure for a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer |  |
| `measure_id` | `path` | Yes | string |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/RuntimeMeasureUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/RuntimeMeasureResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/reports/{report_id}/user-measures/{measure_id}

- OperationId: `delete_user_measure_for_report_api_v1_reports__report_id__user_measures__measure_id__delete`
- Tags: `runtime-measures`
- Summary: Delete user measure for report
- Description: Delete a user measure from a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer |  |
| `measure_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/reports/{report_id}/virtual-reports

- OperationId: `list_virtual_reports_for_parent_api_v1_reports__report_id__virtual_reports_get`
- Tags: `virtual-reports`, `Virtual Reports`
- Summary: List Virtual Reports for Parent
- Description: List all virtual reports for a parent report. Admin/Analyst only.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | ID of the parent report |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/VirtualReportListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/reports/{report_id}/virtual-reports

- OperationId: `create_virtual_report_api_v1_reports__report_id__virtual_reports_post`
- Tags: `virtual-reports`, `Virtual Reports`
- Summary: Create Virtual Report
- Description: Create a new virtual report from a parent report. Requires Admin or Analyst role.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | ID of the parent report |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/VirtualReportCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/VirtualReportResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/reports/categories

- OperationId: `list_categories_api_v1_reports_categories_get`
- Tags: `reports`, `Report Categories`
- Summary: List Report Categories
- Description: List all available report categories.

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/ReportCategoryResponse`> | List of report categories |

---

### POST /api/v1/reports/categories

- OperationId: `create_category_api_v1_reports_categories_post`
- Tags: `reports`, `Report Categories`
- Summary: Create Report Category
- Description: Create a new report category.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ReportCategoryCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/ReportCategoryResponse` | Category created successfully |
| `400` | `N/A` | N/A | Invalid input data |
| `401` | `N/A` | N/A | Unauthorized |
| `409` | `N/A` | N/A | Category with this name already exists |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/reports/preview

- OperationId: `preview_report_api_v1_reports_preview_post`
- Tags: `reports`, `Reports`
- Summary: Preview Report
- Description: Generate a preview of a report based on its definition.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ReportPreviewRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ReportPreviewResponse` | Preview generated successfully |
| `400` | `N/A` | N/A | Invalid report definition |
| `401` | `N/A` | N/A | Unauthorized |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### PUT /api/v1/reports/schedule/{schedule_id}

- OperationId: `update_schedule_api_v1_reports_schedule__schedule_id__put`
- Tags: `reports`, `Report Schedules`
- Summary: Update Report Schedule
- Description: Update an existing report schedule.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `schedule_id` | `path` | Yes | integer | The ID of the schedule to update |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ReportScheduleUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ReportScheduleResponse` | Schedule updated successfully |
| `400` | `N/A` | N/A | Invalid input data |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Schedule not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### DELETE /api/v1/reports/schedule/{schedule_id}

- OperationId: `delete_schedule_api_v1_reports_schedule__schedule_id__delete`
- Tags: `reports`, `Report Schedules`
- Summary: Delete Report Schedule
- Description: Delete an existing report schedule.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `schedule_id` | `path` | Yes | integer | The ID of the schedule to delete |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Schedule deleted successfully |
| `401` | `N/A` | N/A | Unauthorized |
| `403` | `N/A` | N/A | Forbidden - insufficient permissions |
| `404` | `N/A` | N/A | Schedule not found |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |
| `500` | `N/A` | N/A | Internal server error |

---

### POST /api/v1/sharing/{content_type}/{content_id}/share

- OperationId: `share_content_api_v1_sharing__content_type___content_id__share_post`
- Tags: `sharing`
- Summary: Share Content
- Description: Share content with specific users or all viewers. **Admin and Analyst only.** - Set `user_ids` to share with specific users - Set `share_with_all_viewers` to true to share with all viewers - Both can be set simultaneously

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `content_type` | `path` | Yes | string |  |
| `content_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ShareRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/ShareResponse`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/sharing/{content_type}/{content_id}/share/{share_id}

- OperationId: `remove_share_api_v1_sharing__content_type___content_id__share__share_id__delete`
- Tags: `sharing`
- Summary: Remove Share
- Description: Remove a specific share. **Admin and Analyst only.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `content_type` | `path` | Yes | string |  |
| `content_id` | `path` | Yes | integer |  |
| `share_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/api__v1__endpoints__sharing__MessageResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/sharing/{content_type}/{content_id}/shares

- OperationId: `get_content_shares_api_v1_sharing__content_type___content_id__shares_get`
- Tags: `sharing`
- Summary: Get Content Shares
- Description: Get all shares for a specific content item. **Admin and Analyst only.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `content_type` | `path` | Yes | string |  |
| `content_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ShareListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/sharing/{content_type}/{content_id}/shares

- OperationId: `remove_all_shares_api_v1_sharing__content_type___content_id__shares_delete`
- Tags: `sharing`
- Summary: Remove All Shares
- Description: Remove all shares for a specific content item. **Admin and Analyst only.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `content_type` | `path` | Yes | string |  |
| `content_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/api__v1__endpoints__sharing__MessageResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/subscriptions

- OperationId: `list_subscriptions_api_v1_subscriptions_get`
- Tags: `subscriptions`
- Summary: List user's subscriptions
- Description: List all subscriptions for the current user. Supports filtering by content type and active status.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `page` | `query` | No | integer | Page number |
| `page_size` | `query` | No | integer | Items per page |
| `content_type` | `query` | No | anyOf(string | null) | Filter by content type |
| `is_active` | `query` | No | anyOf(boolean | null) | Filter by active status |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SubscriptionListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/subscriptions

- OperationId: `create_subscription_api_v1_subscriptions_post`
- Tags: `subscriptions`
- Summary: Create a new subscription
- Description: Create a new email subscription for a report, dashboard, or question. - **name**: User-friendly name for the subscription - **content_type**: Type of content (report, dashboard, virtual_report, question) - **content_id**: ID of the content to subscribe to - **schedule_type**: Type of schedule (scheduled, triggered, conditional) - **frequency**: For scheduled: hourly, daily, weekly, monthly - **delivery_format**: Format of the attachment (pdf, excel, csv) - **filter_mode**: Filter mode: 'none', 'saved', 'custom' - **saved_filter_id**: ID of saved filter (when filter_mode='saved') - **view_mode**: View mode: 'none', 'saved', 'custom' - **saved_view_id**: ID of saved view (when view_mode='saved') - **recipients**: List of recipients (users, groups, or external emails)

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/SubscriptionCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/SubscriptionResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/subscriptions/{subscription_id}

- OperationId: `get_subscription_api_v1_subscriptions__subscription_id__get`
- Tags: `subscriptions`
- Summary: Get subscription details
- Description: Get details of a specific subscription.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `subscription_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SubscriptionResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/subscriptions/{subscription_id}

- OperationId: `update_subscription_api_v1_subscriptions__subscription_id__put`
- Tags: `subscriptions`
- Summary: Update a subscription
- Description: Update an existing subscription. Only provided fields will be updated. Recipients can be replaced entirely by providing a new recipients list. Filter/View configuration can be updated: - **filter_mode**: 'none', 'saved', 'custom' - **saved_filter_id**: ID of saved filter (when filter_mode='saved') - **view_mode**: 'none', 'saved', 'custom' - **saved_view_id**: ID of saved view (when view_mode='saved')

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `subscription_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/SubscriptionUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SubscriptionResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/subscriptions/{subscription_id}

- OperationId: `delete_subscription_api_v1_subscriptions__subscription_id__delete`
- Tags: `subscriptions`
- Summary: Delete a subscription
- Description: Delete a subscription and all its delivery history.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `subscription_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/subscriptions/{subscription_id}/deliveries

- OperationId: `get_delivery_history_api_v1_subscriptions__subscription_id__deliveries_get`
- Tags: `subscriptions`
- Summary: Get delivery history
- Description: Get delivery history for a subscription.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `subscription_id` | `path` | Yes | integer |  |
| `page` | `query` | No | integer | Page number |
| `page_size` | `query` | No | integer | Items per page |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/DeliveryHistoryResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/subscriptions/{subscription_id}/pause

- OperationId: `pause_subscription_api_v1_subscriptions__subscription_id__pause_post`
- Tags: `subscriptions`
- Summary: Pause a subscription
- Description: Pause an active subscription. It will not send any more emails until resumed.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `subscription_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SubscriptionActionResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/subscriptions/{subscription_id}/resume

- OperationId: `resume_subscription_api_v1_subscriptions__subscription_id__resume_post`
- Tags: `subscriptions`
- Summary: Resume a paused subscription
- Description: Resume a paused subscription.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `subscription_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SubscriptionActionResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/subscriptions/{subscription_id}/send-now

- OperationId: `send_now_api_v1_subscriptions__subscription_id__send_now_post`
- Tags: `subscriptions`
- Summary: Trigger immediate delivery
- Description: Trigger an immediate delivery of the subscription. This does not affect the regular schedule - the next scheduled delivery will still occur as planned.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `subscription_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SendNowResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/subscriptions/admin/{subscription_id}

- OperationId: `admin_delete_subscription_api_v1_subscriptions_admin__subscription_id__delete`
- Tags: `subscriptions`
- Summary: Admin delete a subscription
- Description: Admin delete any subscription (no ownership check).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `subscription_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/subscriptions/admin/{subscription_id}/pause

- OperationId: `admin_pause_subscription_api_v1_subscriptions_admin__subscription_id__pause_post`
- Tags: `subscriptions`
- Summary: Admin pause a subscription
- Description: Admin pause any subscription (no ownership check).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `subscription_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SubscriptionActionResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/subscriptions/admin/{subscription_id}/resume

- OperationId: `admin_resume_subscription_api_v1_subscriptions_admin__subscription_id__resume_post`
- Tags: `subscriptions`
- Summary: Admin resume a subscription
- Description: Admin resume any subscription (no ownership check).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `subscription_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SubscriptionActionResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/subscriptions/admin/all

- OperationId: `admin_list_all_subscriptions_api_v1_subscriptions_admin_all_get`
- Tags: `subscriptions`
- Summary: List all subscriptions (admin only)
- Description: List all subscriptions in the system (admin only). Returns subscriptions with additional admin details like owner info and delivery statistics.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `page` | `query` | No | integer | Page number |
| `page_size` | `query` | No | integer | Items per page |
| `content_type` | `query` | No | anyOf(string | null) | Filter by content type |
| `is_active` | `query` | No | anyOf(boolean | null) | Filter by active status |
| `owner_id` | `query` | No | anyOf(integer | null) | Filter by owner user ID |
| `search` | `query` | No | anyOf(string | null) | Search by subscription name |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/AdminSubscriptionListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/subscriptions/admin/analytics

- OperationId: `get_subscription_analytics_api_v1_subscriptions_admin_analytics_get`
- Tags: `subscriptions`
- Summary: Get subscription analytics (admin only)
- Description: Get subscription analytics for the admin dashboard. Returns: - Summary statistics (total, active, paused subscriptions, delivery counts) - Breakdown by content type - Breakdown by frequency - Delivery trends over time - Top subscriptions by delivery count - Recent failures

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `days` | `query` | No | integer | Number of days for trend data |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SubscriptionAnalyticsResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/subscriptions/content/{content_type}/{content_id}

- OperationId: `get_content_subscriptions_api_v1_subscriptions_content__content_type___content_id__get`
- Tags: `subscriptions`
- Summary: Get subscriptions for content
- Description: Get all subscriptions for a specific content item (report, dashboard, etc.). This is useful for showing subscription status on the content page. Admins can see all subscriptions for the content, regular users only see their own.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `content_type` | `path` | Yes | string |  |
| `content_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ContentSubscriptionsResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/subscriptions/deliveries/{delivery_id}/download

- OperationId: `download_delivery_file_api_v1_subscriptions_deliveries__delivery_id__download_get`
- Tags: `subscriptions`
- Summary: Download delivery file
- Description: Download the generated file for a delivery. This is used when the file was too large to attach to the email.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `delivery_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/subscriptions/external-recipients/{recipient_id}/approve

- OperationId: `approve_external_recipient_api_v1_subscriptions_external_recipients__recipient_id__approve_post`
- Tags: `subscriptions`
- Summary: Approve or reject an external recipient
- Description: Approve or reject an external email recipient. Only admins can approve external recipients.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `recipient_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ExternalRecipientApproval` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SubscriptionActionResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/subscriptions/external-recipients/pending

- OperationId: `list_pending_external_recipients_api_v1_subscriptions_external_recipients_pending_get`
- Tags: `subscriptions`
- Summary: List pending external recipient approvals
- Description: List external email recipients pending approval. Only admins can view and approve external recipients.

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/PendingExternalRecipient`> | Successful Response |

---

### GET /api/v1/subscriptions/recipients/groups

- OperationId: `list_recipient_groups_api_v1_subscriptions_recipients_groups_get`
- Tags: `subscriptions`
- Summary: List groups for recipient selection
- Description: List groups available as subscription recipients. Returns active groups with member counts, optionally filtered by search term.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `search` | `query` | No | anyOf(string | null) | Search by group name |
| `limit` | `query` | No | integer | Maximum results |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/GroupSearchResult`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/subscriptions/recipients/search

- OperationId: `search_recipients_api_v1_subscriptions_recipients_search_get`
- Tags: `subscriptions`
- Summary: Search users and groups for recipient selection
- Description: Search for users and groups to add as subscription recipients. Returns matching users (by name or email) and groups (by name). Results are limited to active users and groups only.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `q` | `query` | Yes | string | Search query |
| `limit` | `query` | No | integer | Maximum results per type |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/RecipientSearchResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/subscriptions/recipients/users

- OperationId: `list_recipient_users_api_v1_subscriptions_recipients_users_get`
- Tags: `subscriptions`
- Summary: List users for recipient selection
- Description: List users available as subscription recipients. Returns active users, optionally filtered by search term.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `search` | `query` | No | anyOf(string | null) | Search by name or email |
| `limit` | `query` | No | integer | Maximum results |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/api__v1__endpoints__subscriptions__UserSearchResult`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/sync-logs/

- OperationId: `list_sync_logs_api_v1_sync_logs__get`
- Tags: `sync-logs`
- Summary: List Sync Logs
- Description: List sync logs with optional filtering and pagination. Supports filtering by: - table_id: Specific table - data_source_id: All tables in a data source - sync_type: full, incremental, or metadata - status: success, failed, in_progress, cancelled - start_date/end_date: Date range Returns paginated results ordered by start_time DESC (most recent first).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `query` | No | anyOf(integer | null) | Filter by table ID |
| `data_source_id` | `query` | No | anyOf(integer | null) | Filter by data source ID |
| `sync_type` | `query` | No | anyOf(string | null) | Filter by sync type (full, incremental, metadata) |
| `status` | `query` | No | anyOf(string | null) | Filter by status (success, failed, in_progress, cancelled) |
| `start_date` | `query` | No | anyOf(string | null) | Filter logs starting from this date |
| `end_date` | `query` | No | anyOf(string | null) | Filter logs up to this date |
| `skip` | `query` | No | integer | Number of records to skip |
| `limit` | `query` | No | integer | Maximum number of records to return |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SyncLogList` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/sync-logs/{sync_log_id}

- OperationId: `get_sync_log_api_v1_sync_logs__sync_log_id__get`
- Tags: `sync-logs`
- Summary: Get Sync Log
- Description: Get a specific sync log by ID.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `sync_log_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SyncLogResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/sync-logs/stats/summary

- OperationId: `get_sync_stats_api_v1_sync_logs_stats_summary_get`
- Tags: `sync-logs`
- Summary: Get Sync Stats
- Description: Get sync statistics summary. Returns counts by status, average duration, total rows synced, etc.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `data_source_id` | `query` | No | anyOf(integer | null) | Filter by data source ID |
| `start_date` | `query` | No | anyOf(string | null) | Stats from this date |
| `end_date` | `query` | No | anyOf(string | null) | Stats up to this date |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/sync-logs/tables/{table_id}/latest

- OperationId: `get_latest_sync_log_api_v1_sync_logs_tables__table_id__latest_get`
- Tags: `sync-logs`
- Summary: Get Latest Sync Log
- Description: Get the most recent sync log for a specific table.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer |  |
| `sync_type` | `query` | No | anyOf(string | null) | Filter by sync type |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SyncLogResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/sync/all

- OperationId: `sync_all_data_sources_api_v1_sync_all_post`
- Tags: `sync`, `sync`
- Summary: Sync All Data Sources
- Description: Synchronize all enabled tables using background processing. Uses thread pool for non-blocking background execution. Returns immediately with a task_id for status tracking. Args:     request: Sync configuration     db: Database session      Returns:     Sync operation result with task ID for status tracking

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/SyncAllRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SyncResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/sync/status

- OperationId: `get_sync_status_api_v1_sync_status_get`
- Tags: `sync`, `sync`
- Summary: Get Sync Status
- Description: Get sync status summary. Args:     data_source_name: Optional specific data source to get status for     db: Database session      Returns:     Sync status summary

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `data_source_name` | `query` | No | anyOf(string | null) |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SyncResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/tables/

- OperationId: `list_tables_api_v1_tables__get`
- Tags: `tables`
- Summary: List Tables
- Description: List tables from the metadata database.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `data_source_id` | `query` | No | anyOf(integer | null) |  |
| `is_active` | `query` | No | anyOf(boolean | null) |  |
| `sync_enabled` | `query` | No | anyOf(boolean | null) |  |
| `search` | `query` | No | anyOf(string | null) |  |
| `skip` | `query` | No | integer |  |
| `limit` | `query` | No | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/TableList` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/tables/

- OperationId: `create_table_api_v1_tables__post`
- Tags: `tables`
- Summary: Create Table
- Description: Create a new table in the metadata database.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/TableCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/TableResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/tables/{table_id}

- OperationId: `get_table_api_v1_tables__table_id__get`
- Tags: `tables`
- Summary: Get Table
- Description: Get a specific table by ID.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/TableResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/tables/{table_id}

- OperationId: `update_table_api_v1_tables__table_id__put`
- Tags: `tables`
- Summary: Update Table
- Description: Update an existing table. Automatically syncs sync_method and sync_config.strategy to maintain consistency: - If sync_method is updated, sync_config.strategy is also updated - If sync_config.strategy is updated, sync_method is also updated

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/TableUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/TableResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/tables/{table_id}

- OperationId: `delete_table_api_v1_tables__table_id__delete`
- Tags: `tables`
- Summary: Delete Table
- Description: Delete a table and its associated columns.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/tables/{table_id}/data-preview

- OperationId: `get_table_data_preview_api_v1_tables__table_id__data_preview_get`
- Tags: `tables`
- Summary: Get Table Data Preview
- Description: Get a preview of the Parquet data for a specific table.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer |  |
| `limit` | `query` | No | integer | Number of rows to return |
| `offset` | `query` | No | integer | Number of rows to skip |
| `columns` | `query` | No | anyOf(string | null) | Comma-separated list of columns to include |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/tables/{table_id}/disable-sync

- OperationId: `disable_table_sync_api_v1_tables__table_id__disable_sync_post`
- Tags: `tables`
- Summary: Disable Table Sync
- Description: Disable synchronization for a table. This will exclude the table from scheduled and manual sync operations.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/TableResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/tables/{table_id}/enable-sync

- OperationId: `enable_table_sync_api_v1_tables__table_id__enable_sync_post`
- Tags: `tables`
- Summary: Enable Table Sync
- Description: Enable synchronization for a table. This will allow the table to be included in scheduled and manual sync operations.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/TableResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/tables/{table_id}/sync

- OperationId: `sync_table_api_v1_tables__table_id__sync_post`
- Tags: `sync`, `sync`
- Summary: Sync Table
- Description: Synchronize a specific table using background processing. Uses thread pool for non-blocking background execution. Returns immediately with a task_id for status tracking. Args:     table_id: ID of the table to sync     request: Sync configuration     db: Database session      Returns:     Sync operation result with task ID for status tracking

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/SyncTableRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SyncResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/tables/{table_id}/sync-config

- OperationId: `get_table_sync_config_api_v1_tables__table_id__sync_config_get`
- Tags: `tables`
- Summary: Get Table Sync Config
- Description: Get sync configuration for a table. Returns the current sync configuration including: - strategy: "full", "incremental", or "hybrid" - keys: unique_key_column_id, change_tracking_column_ids - schedule: full and incremental sync schedules - watermarks: max_id, last_timestamp for incremental sync - options: verify_with_hash, detect_deletes settings

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/tables/{table_id}/sync-config

- OperationId: `update_table_sync_config_api_v1_tables__table_id__sync_config_put`
- Tags: `tables`
- Summary: Update Table Sync Config
- Description: Update sync configuration for a table. Validates and saves the sync configuration. The configuration should include: - strategy: "full", "incremental", or "hybrid" - keys: unique_key_column_id, change_tracking_column_ids - schedule: full and incremental sync schedules (for hybrid) - options: verify_with_hash, detect_deletes settings

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | object |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/tables/{table_id}/sync-config

- OperationId: `delete_table_sync_config_api_v1_tables__table_id__sync_config_delete`
- Tags: `tables`
- Summary: Delete Table Sync Config
- Description: Delete sync configuration for a table. This will reset the table to use full sync strategy (default behavior).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/tables/{table_id}/sync-config/auto-detect

- OperationId: `auto_detect_table_sync_config_api_v1_tables__table_id__sync_config_auto_detect_post`
- Tags: `tables`
- Summary: Auto Detect Table Sync Config
- Description: Auto-detect sync configuration for a table. Analyzes table columns to determine: - Best sync strategy (full, incremental, hybrid) - Unique key column for change tracking - Timestamp columns for incremental filtering If save=True, the detected configuration will be saved to the table.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer |  |
| `save` | `query` | No | boolean | Save the auto-detected configuration |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/tables/{table_id}/sync-config/columns

- OperationId: `get_table_sync_config_columns_api_v1_tables__table_id__sync_config_columns_get`
- Tags: `tables`
- Summary: Get Table Sync Config Columns
- Description: Get available columns for sync configuration. Returns columns that can be used for: - Unique key (is_unique_id flag or numeric columns) - Change tracking (datetime/timestamp columns)

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `table_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/tables/bulk-sync-update

- OperationId: `bulk_update_table_sync_api_v1_tables_bulk_sync_update_post`
- Tags: `tables`
- Summary: Bulk Update Table Sync
- Description: Bulk enable or disable synchronization for multiple tables. This allows updating sync status for multiple tables in a single request.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/BulkSyncUpdateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/BulkSyncUpdateResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/tasks/{task_id}/status

- OperationId: `get_task_status_api_v1_tasks__task_id__status_get`
- Tags: `sync`, `sync`
- Summary: Get Task Status
- Description: Get the status of a sync task. Retrieves status from the background sync service registry or database. Args:     task_id: Task ID (sync-* format from thread pool)      Returns:     Task status information

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `task_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/user/preferences/reports/{report_id}

- OperationId: `get_report_preferences_api_v1_user_preferences_reports__report_id__get`
- Tags: `user-preferences`, `User Preferences`
- Summary: Get User Preferences for Report
- Description: Get the current user's viewing preferences for a specific report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/UserPreferencesResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/user/preferences/reports/{report_id}

- OperationId: `save_report_preferences_api_v1_user_preferences_reports__report_id__post`
- Tags: `user-preferences`, `User Preferences`
- Summary: Save User Preferences for Report
- Description: Create or update the current user's viewing preferences for a specific report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/UserPreferencesCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/UserPreferencesResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/user/preferences/reports/{report_id}

- OperationId: `delete_report_preferences_api_v1_user_preferences_reports__report_id__delete`
- Tags: `user-preferences`, `User Preferences`
- Summary: Delete User Preferences for Report
- Description: Delete the current user's viewing preferences for a specific report (reset to defaults).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/user/preferences/virtual-reports/{virtual_report_id}

- OperationId: `get_virtual_report_preferences_api_v1_user_preferences_virtual_reports__virtual_report_id__get`
- Tags: `user-preferences`, `User Preferences`
- Summary: Get User Preferences for Virtual Report
- Description: Get the current user's viewing preferences for a specific virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/UserPreferencesResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/user/preferences/virtual-reports/{virtual_report_id}

- OperationId: `save_virtual_report_preferences_api_v1_user_preferences_virtual_reports__virtual_report_id__post`
- Tags: `user-preferences`, `User Preferences`
- Summary: Save User Preferences for Virtual Report
- Description: Create or update the current user's viewing preferences for a specific virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/UserPreferencesCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/UserPreferencesResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/user/preferences/virtual-reports/{virtual_report_id}

- OperationId: `delete_virtual_report_preferences_api_v1_user_preferences_virtual_reports__virtual_report_id__delete`
- Tags: `user-preferences`, `User Preferences`
- Summary: Delete User Preferences for Virtual Report
- Description: Delete the current user's viewing preferences for a specific virtual report (reset to defaults).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/user/views/reports/{report_id}

- OperationId: `list_report_views_api_v1_user_views_reports__report_id__get`
- Tags: `saved-views`, `Saved Views`
- Summary: List Saved Views for Report
- Description: Get all saved views (own + shared) for a specific report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ViewListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/user/views/reports/{report_id}

- OperationId: `create_report_view_api_v1_user_views_reports__report_id__post`
- Tags: `saved-views`, `Saved Views`
- Summary: Create Saved View
- Description: Create a new saved view for a report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ViewCreateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/SavedViewResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/user/views/reports/{report_id}/{view_id}

- OperationId: `get_report_view_api_v1_user_views_reports__report_id___view_id__get`
- Tags: `saved-views`, `Saved Views`
- Summary: Get Saved View
- Description: Get a specific saved view by ID.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |
| `view_id` | `path` | Yes | integer | View ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SavedViewResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/user/views/reports/{report_id}/{view_id}

- OperationId: `update_report_view_api_v1_user_views_reports__report_id___view_id__put`
- Tags: `saved-views`, `Saved Views`
- Summary: Update Saved View
- Description: Update an existing saved view (owner only).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |
| `view_id` | `path` | Yes | integer | View ID |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ViewUpdateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SavedViewResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/user/views/reports/{report_id}/{view_id}

- OperationId: `delete_report_view_api_v1_user_views_reports__report_id___view_id__delete`
- Tags: `saved-views`, `Saved Views`
- Summary: Delete Saved View
- Description: Delete a saved view (owner only).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |
| `view_id` | `path` | Yes | integer | View ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/user/views/reports/{report_id}/{view_id}/copy

- OperationId: `copy_report_view_api_v1_user_views_reports__report_id___view_id__copy_post`
- Tags: `saved-views`, `Saved Views`
- Summary: Copy View
- Description: Copy a view (own or shared) to create a new personal view.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |
| `view_id` | `path` | Yes | integer | View ID to copy |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ViewCopyRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/SavedViewResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/user/views/reports/{report_id}/{view_id}/set-default

- OperationId: `set_default_report_view_api_v1_user_views_reports__report_id___view_id__set_default_post`
- Tags: `saved-views`, `Saved Views`
- Summary: Set Default View
- Description: Set a view as the user's default for this report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |
| `view_id` | `path` | Yes | integer | View ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SavedViewResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/user/views/reports/{report_id}/clear-default

- OperationId: `clear_default_report_view_api_v1_user_views_reports__report_id__clear_default_post`
- Tags: `saved-views`, `Saved Views`
- Summary: Clear Default View
- Description: Clear the user's default view for this report (use 'None').

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `report_id` | `path` | Yes | integer | Report ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/user/views/virtual-reports/{virtual_report_id}

- OperationId: `list_virtual_report_views_api_v1_user_views_virtual_reports__virtual_report_id__get`
- Tags: `saved-views`, `Saved Views`
- Summary: List Saved Views for Virtual Report
- Description: Get all saved views (own + shared) for a specific virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/ViewListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/user/views/virtual-reports/{virtual_report_id}

- OperationId: `create_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id__post`
- Tags: `saved-views`, `Saved Views`
- Summary: Create Saved View for Virtual Report
- Description: Create a new saved view for a virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ViewCreateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/SavedViewResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/user/views/virtual-reports/{virtual_report_id}/{view_id}

- OperationId: `get_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id___view_id__get`
- Tags: `saved-views`, `Saved Views`
- Summary: Get Saved View for Virtual Report
- Description: Get a specific saved view by ID for a virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |
| `view_id` | `path` | Yes | integer | View ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SavedViewResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/user/views/virtual-reports/{virtual_report_id}/{view_id}

- OperationId: `update_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id___view_id__put`
- Tags: `saved-views`, `Saved Views`
- Summary: Update Saved View for Virtual Report
- Description: Update an existing saved view for a virtual report (owner only).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |
| `view_id` | `path` | Yes | integer | View ID |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ViewUpdateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SavedViewResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/user/views/virtual-reports/{virtual_report_id}/{view_id}

- OperationId: `delete_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id___view_id__delete`
- Tags: `saved-views`, `Saved Views`
- Summary: Delete Saved View for Virtual Report
- Description: Delete a saved view for a virtual report (owner only).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |
| `view_id` | `path` | Yes | integer | View ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/user/views/virtual-reports/{virtual_report_id}/{view_id}/copy

- OperationId: `copy_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id___view_id__copy_post`
- Tags: `saved-views`, `Saved Views`
- Summary: Copy View for Virtual Report
- Description: Copy a view (own or shared) to create a new personal view for a virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |
| `view_id` | `path` | Yes | integer | View ID to copy |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ViewCopyRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/SavedViewResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/user/views/virtual-reports/{virtual_report_id}/{view_id}/set-default

- OperationId: `set_default_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id___view_id__set_default_post`
- Tags: `saved-views`, `Saved Views`
- Summary: Set Default View for Virtual Report
- Description: Set a view as the user's default for this virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |
| `view_id` | `path` | Yes | integer | View ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SavedViewResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/user/views/virtual-reports/{virtual_report_id}/clear-default

- OperationId: `clear_default_virtual_report_view_api_v1_user_views_virtual_reports__virtual_report_id__clear_default_post`
- Tags: `saved-views`, `Saved Views`
- Summary: Clear Default View for Virtual Report
- Description: Clear the user's default view for this virtual report (use 'None').

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/users

- OperationId: `list_users_api_v1_users_get`
- Tags: `users`
- Summary: List Users
- Description: List all users with optional filtering and pagination. **Admin only.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `skip` | `query` | No | integer | Number of records to skip |
| `limit` | `query` | No | integer | Maximum number of records to return |
| `search` | `query` | No | anyOf(string | null) | Search by email or name |
| `role` | `query` | No | anyOf(string | null) | Filter by role (Admin, Analyst, Viewer) |
| `is_active` | `query` | No | anyOf(boolean | null) | Filter by active status |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/UserListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/users

- OperationId: `create_user_api_v1_users_post`
- Tags: `users`
- Summary: Create User
- Description: Create a new user. **Admin only.** Password requirements: - Minimum 8 characters - At least one uppercase letter - At least one lowercase letter - At least one number - At least one special character (!@#$%^&*)

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/UserCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/User` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/users/{user_id}

- OperationId: `get_user_api_v1_users__user_id__get`
- Tags: `users`
- Summary: Get User
- Description: Get a user by ID. **Admin only.**

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `user_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/User` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/users/{user_id}

- OperationId: `update_user_api_v1_users__user_id__put`
- Tags: `users`
- Summary: Update User
- Description: Update an existing user. **Admin only.** All fields are optional. Only provided fields will be updated.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `user_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/UserUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/User` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/users/{user_id}

- OperationId: `delete_user_api_v1_users__user_id__delete`
- Tags: `users`
- Summary: Delete User
- Description: Delete (deactivate) a user. **Admin only.** This performs a soft delete by setting the user's is_active status to False. You cannot delete your own account.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `user_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/users/{user_id}/reset-password

- OperationId: `reset_user_password_api_v1_users__user_id__reset_password_post`
- Tags: `users`
- Summary: Reset User Password
- Description: Reset a user's password. **Admin only.** Password requirements: - Minimum 8 characters - At least one uppercase letter - At least one lowercase letter - At least one number - At least one special character (!@#$%^&*)

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `user_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ResetPasswordRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/api__v1__endpoints__auth__schemas__MessageResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/users/me

- OperationId: `get_current_user_profile_api_v1_users_me_get`
- Tags: `users`
- Summary: Get Current User Profile
- Description: Get current user's profile. **Any authenticated user.**

#### Parameters

_None_

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/User` | Successful Response |

---

### PUT /api/v1/users/me

- OperationId: `update_current_user_profile_api_v1_users_me_put`
- Tags: `users`
- Summary: Update Current User Profile
- Description: Update current user's profile. **Any authenticated user.** Users can only update their own full_name. Email and role changes require admin.

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/UpdateProfileRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/User` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/users/me/change-password

- OperationId: `change_password_api_v1_users_me_change_password_post`
- Tags: `users`
- Summary: Change Password
- Description: Change current user's password. **Any authenticated user.** Password requirements: - Minimum 8 characters - At least one uppercase letter - At least one lowercase letter - At least one number - At least one special character (!@#$%^&*)

#### Parameters

_None_

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/ChangePasswordRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/api__v1__endpoints__auth__schemas__MessageResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/users/search

- OperationId: `search_users_api_v1_users_search_get`
- Tags: `users`
- Summary: Search Users
- Description: Search active users by full name or email (case-insensitive, partial match).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `q` | `query` | Yes | string | Search users by full name or email (partial match) |
| `limit` | `query` | No | integer | Maximum number of results to return |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | array<`#/components/schemas/api__v1__endpoints__users__UserSearchResult`> | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/virtual-reports/{id}

- OperationId: `get_virtual_report_api_v1_virtual_reports__id__get`
- Tags: `virtual-reports`, `Virtual Reports`
- Summary: Get Virtual Report
- Description: Get virtual report details. Response varies based on user role.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `id` | `path` | Yes | integer | ID of the virtual report |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/virtual-reports/{id}

- OperationId: `update_virtual_report_api_v1_virtual_reports__id__put`
- Tags: `virtual-reports`, `Virtual Reports`
- Summary: Update Virtual Report
- Description: Update a virtual report. Admin/Analyst only.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `id` | `path` | Yes | integer | ID of the virtual report |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/VirtualReportUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/VirtualReportResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/virtual-reports/{id}

- OperationId: `delete_virtual_report_api_v1_virtual_reports__id__delete`
- Tags: `virtual-reports`, `Virtual Reports`
- Summary: Delete Virtual Report
- Description: Delete a virtual report. Admin/Analyst only.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `id` | `path` | Yes | integer | ID of the virtual report |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/virtual-reports/{id}/columns/{column_name}/unique-values

- OperationId: `get_virtual_report_unique_values_api_v1_virtual_reports__id__columns__column_name__unique_values_get`
- Tags: `virtual-reports`, `Virtual Reports - Query`
- Summary: Get Unique Column Values for Virtual Report
- Description: Get unique values for a column with virtual filter applied.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `id` | `path` | Yes | integer | ID of the virtual report |
| `column_name` | `path` | Yes | string | Name of the column |
| `limit` | `query` | No | integer | Maximum number of values to return |
| `search` | `query` | No | anyOf(string | null) | Search term to filter values |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/api__v1__endpoints__virtual_reports__UniqueValuesResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/virtual-reports/{id}/drill-level

- OperationId: `get_virtual_report_drill_level_api_v1_virtual_reports__id__drill_level_get`
- Tags: `virtual-reports`, `Virtual Reports - Query`
- Summary: Query Virtual Report Drill Level
- Description: Query a specific drill level for virtual reports based on drill-down parent reports.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `id` | `path` | Yes | integer | ID of the virtual report |
| `level` | `query` | No | integer | Drill level to query |
| `drill_path` | `query` | No | anyOf(string | null) | JSON-encoded drill path filters |
| `runtime_filters` | `query` | No | anyOf(string | null) | JSON-encoded runtime filters |
| `sorting` | `query` | No | anyOf(string | null) | JSON-encoded sorting configuration |
| `page` | `query` | No | integer | Page number |
| `page_size` | `query` | No | integer | Number of rows per page |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | object | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/virtual-reports/{id}/grand-totals

- OperationId: `get_virtual_report_grand_totals_api_v1_virtual_reports__id__grand_totals_get`
- Tags: `virtual-reports`, `Virtual Reports - Query`
- Summary: Get Virtual Report Grand Totals
- Description: Get grand totals for a virtual report (with virtual filter and optional runtime filters applied).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `id` | `path` | Yes | integer | ID of the virtual report |
| `runtime_filters` | `query` | No | anyOf(string | null) | JSON-encoded additional runtime filters, e.g., [{"field":"Region","operator":"equals","value":"West"}] |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/GrandTotalsResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/virtual-reports/{id}/query

- OperationId: `query_virtual_report_api_v1_virtual_reports__id__query_post`
- Tags: `virtual-reports`, `Virtual Reports - Query`
- Summary: Query Virtual Report Data
- Description: Query virtual report data with combined filters (virtual filter + user filters).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `id` | `path` | Yes | integer | ID of the virtual report |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/VirtualReportQueryRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/VirtualReportQueryResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/virtual-reports/{virtual_report_id}/measures

- OperationId: `list_vr_measures_api_v1_virtual_reports__virtual_report_id__measures_get`
- Tags: `runtime-measures`
- Summary: List VR measures
- Description: Get all measures for a virtual report, including inherited from parent.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer |  |
| `include_inherited` | `query` | No | boolean | Include inherited measures from parent report |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/VirtualReportMeasuresResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/virtual-reports/{virtual_report_id}/measures

- OperationId: `add_vr_measure_api_v1_virtual_reports__virtual_report_id__measures_post`
- Tags: `runtime-measures`
- Summary: Add VR measure
- Description: Add a new runtime measure to a virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/RuntimeMeasureCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/RuntimeMeasureResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/virtual-reports/{virtual_report_id}/measures/{measure_id}

- OperationId: `delete_vr_measure_api_v1_virtual_reports__virtual_report_id__measures__measure_id__delete`
- Tags: `runtime-measures`
- Summary: Delete VR measure
- Description: Delete a runtime measure from a virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer |  |
| `measure_id` | `path` | Yes | string |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PATCH /api/v1/virtual-reports/{virtual_report_id}/measures/inheritance

- OperationId: `update_vr_inheritance_config_api_v1_virtual_reports__virtual_report_id__measures_inheritance_patch`
- Tags: `runtime-measures`
- Summary: Update inheritance config
- Description: Update measure inheritance configuration for a virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/MeasureInheritanceUpdateRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/MeasureInheritanceConfig` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/virtual-reports/{virtual_report_id}/saved-filters

- OperationId: `list_virtual_report_saved_filters_api_v1_virtual_reports__virtual_report_id__saved_filters_get`
- Tags: `saved-filters`, `Virtual Reports - Saved Filters`
- Summary: List Saved Filters for Virtual Report
- Description: Get all saved filters for a virtual report that the current user can access.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |
| `include_shared` | `query` | No | boolean | Include shared filters from other users |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SavedFiltersListResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### POST /api/v1/virtual-reports/{virtual_report_id}/saved-filters

- OperationId: `create_virtual_report_saved_filter_api_v1_virtual_reports__virtual_report_id__saved_filters_post`
- Tags: `saved-filters`, `Virtual Reports - Saved Filters`
- Summary: Create Saved Filter for Virtual Report
- Description: Save a new filter configuration for a virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/SavedFilterCreate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `201` | `application/json` | ref: `#/components/schemas/SavedFilterResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/virtual-reports/{virtual_report_id}/saved-filters/{filter_id}

- OperationId: `get_virtual_report_saved_filter_api_v1_virtual_reports__virtual_report_id__saved_filters__filter_id__get`
- Tags: `saved-filters`, `Virtual Reports - Saved Filters`
- Summary: Get Saved Filter for Virtual Report
- Description: Get a specific saved filter by ID for a virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |
| `filter_id` | `path` | Yes | integer | Saved filter ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SavedFilterResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/virtual-reports/{virtual_report_id}/saved-filters/{filter_id}

- OperationId: `update_virtual_report_saved_filter_api_v1_virtual_reports__virtual_report_id__saved_filters__filter_id__put`
- Tags: `saved-filters`, `Virtual Reports - Saved Filters`
- Summary: Update Saved Filter for Virtual Report
- Description: Update an existing saved filter for a virtual report. Only the owner can update.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |
| `filter_id` | `path` | Yes | integer | Saved filter ID |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/SavedFilterUpdate` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/SavedFilterResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### DELETE /api/v1/virtual-reports/{virtual_report_id}/saved-filters/{filter_id}

- OperationId: `delete_virtual_report_saved_filter_api_v1_virtual_reports__virtual_report_id__saved_filters__filter_id__delete`
- Tags: `saved-filters`, `Virtual Reports - Saved Filters`
- Summary: Delete Saved Filter for Virtual Report
- Description: Delete a saved filter for a virtual report. Only the owner can delete.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |
| `filter_id` | `path` | Yes | integer | Saved filter ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `204` | `N/A` | N/A | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/virtual-reports/{virtual_report_id}/saved-filters/default

- OperationId: `get_virtual_report_default_filter_api_v1_virtual_reports__virtual_report_id__saved_filters_default_get`
- Tags: `saved-filters`, `Virtual Reports - Saved Filters`
- Summary: Get Default Saved Filter for Virtual Report
- Description: Get the default saved filter for a virtual report (if any).

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer | Virtual Report ID |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | anyOf(ref: `#/components/schemas/SavedFilterResponse` | null) | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### GET /api/v1/virtual-reports/{virtual_report_id}/user-measures

- OperationId: `get_user_measures_for_vr_api_v1_virtual_reports__virtual_report_id__user_measures_get`
- Tags: `runtime-measures`
- Summary: Get user measures for VR
- Description: Get current user's personal measures for a virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer |  |

#### Request Body

_None_

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/UserMeasuresResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

### PUT /api/v1/virtual-reports/{virtual_report_id}/user-measures

- OperationId: `save_user_measures_for_vr_api_v1_virtual_reports__virtual_report_id__user_measures_put`
- Tags: `runtime-measures`
- Summary: Save user measures for VR
- Description: Save (replace) user's personal measures for a virtual report.

#### Parameters

| Name | In | Required | Type/Schema | Description |
|---|---|---|---|---|
| `virtual_report_id` | `path` | Yes | integer |  |

#### Request Body

| Required | Content-Type | Schema | Description |
|---|---|---|---|
| Yes | `application/json` | ref: `#/components/schemas/UserMeasuresSaveRequest` |  |

#### Responses

| Status | Content-Type | Schema | Description |
|---|---|---|---|
| `200` | `application/json` | ref: `#/components/schemas/UserMeasuresResponse` | Successful Response |
| `422` | `application/json` | ref: `#/components/schemas/HTTPValidationError` | Validation Error |

---

