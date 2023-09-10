// Generated from spec/benchmarks/MySQLParser.g4 by ANTLR 4.13.1

import { ParseTreeListener } from "antlr4ng";


import { MySQLBaseRecognizer } from "../support/MySQLBaseRecognizer.js";
import { SqlMode } from "../support/MySQLRecognizerCommon.js";


import { QueryContext } from "./MySQLParser.js";
import { SimpleStatementContext } from "./MySQLParser.js";
import { AlterStatementContext } from "./MySQLParser.js";
import { AlterDatabaseContext } from "./MySQLParser.js";
import { AlterDatabaseOptionContext } from "./MySQLParser.js";
import { AlterEventContext } from "./MySQLParser.js";
import { AlterLogfileGroupContext } from "./MySQLParser.js";
import { AlterLogfileGroupOptionsContext } from "./MySQLParser.js";
import { AlterLogfileGroupOptionContext } from "./MySQLParser.js";
import { AlterServerContext } from "./MySQLParser.js";
import { AlterTableContext } from "./MySQLParser.js";
import { AlterTableActionsContext } from "./MySQLParser.js";
import { AlterCommandListContext } from "./MySQLParser.js";
import { AlterCommandsModifierListContext } from "./MySQLParser.js";
import { StandaloneAlterCommandsContext } from "./MySQLParser.js";
import { AlterPartitionContext } from "./MySQLParser.js";
import { AlterListContext } from "./MySQLParser.js";
import { AlterCommandsModifierContext } from "./MySQLParser.js";
import { AlterListItemContext } from "./MySQLParser.js";
import { PlaceContext } from "./MySQLParser.js";
import { RestrictContext } from "./MySQLParser.js";
import { AlterOrderListContext } from "./MySQLParser.js";
import { AlterAlgorithmOptionContext } from "./MySQLParser.js";
import { AlterLockOptionContext } from "./MySQLParser.js";
import { IndexLockAndAlgorithmContext } from "./MySQLParser.js";
import { WithValidationContext } from "./MySQLParser.js";
import { RemovePartitioningContext } from "./MySQLParser.js";
import { AllOrPartitionNameListContext } from "./MySQLParser.js";
import { AlterTablespaceContext } from "./MySQLParser.js";
import { AlterUndoTablespaceContext } from "./MySQLParser.js";
import { UndoTableSpaceOptionsContext } from "./MySQLParser.js";
import { UndoTableSpaceOptionContext } from "./MySQLParser.js";
import { AlterTablespaceOptionsContext } from "./MySQLParser.js";
import { AlterTablespaceOptionContext } from "./MySQLParser.js";
import { ChangeTablespaceOptionContext } from "./MySQLParser.js";
import { AlterViewContext } from "./MySQLParser.js";
import { ViewTailContext } from "./MySQLParser.js";
import { ViewQueryBlockContext } from "./MySQLParser.js";
import { ViewCheckOptionContext } from "./MySQLParser.js";
import { AlterInstanceStatementContext } from "./MySQLParser.js";
import { CreateStatementContext } from "./MySQLParser.js";
import { CreateDatabaseContext } from "./MySQLParser.js";
import { CreateDatabaseOptionContext } from "./MySQLParser.js";
import { CreateTableContext } from "./MySQLParser.js";
import { TableElementListContext } from "./MySQLParser.js";
import { TableElementContext } from "./MySQLParser.js";
import { DuplicateAsQeContext } from "./MySQLParser.js";
import { AsCreateQueryExpressionContext } from "./MySQLParser.js";
import { QueryExpressionOrParensContext } from "./MySQLParser.js";
import { QueryExpressionWithOptLockingClausesContext } from "./MySQLParser.js";
import { CreateRoutineContext } from "./MySQLParser.js";
import { CreateProcedureContext } from "./MySQLParser.js";
import { CreateFunctionContext } from "./MySQLParser.js";
import { CreateUdfContext } from "./MySQLParser.js";
import { RoutineCreateOptionContext } from "./MySQLParser.js";
import { RoutineAlterOptionsContext } from "./MySQLParser.js";
import { RoutineOptionContext } from "./MySQLParser.js";
import { CreateIndexContext } from "./MySQLParser.js";
import { IndexNameAndTypeContext } from "./MySQLParser.js";
import { CreateIndexTargetContext } from "./MySQLParser.js";
import { CreateLogfileGroupContext } from "./MySQLParser.js";
import { LogfileGroupOptionsContext } from "./MySQLParser.js";
import { LogfileGroupOptionContext } from "./MySQLParser.js";
import { CreateServerContext } from "./MySQLParser.js";
import { ServerOptionsContext } from "./MySQLParser.js";
import { ServerOptionContext } from "./MySQLParser.js";
import { CreateTablespaceContext } from "./MySQLParser.js";
import { CreateUndoTablespaceContext } from "./MySQLParser.js";
import { TsDataFileNameContext } from "./MySQLParser.js";
import { TsDataFileContext } from "./MySQLParser.js";
import { TablespaceOptionsContext } from "./MySQLParser.js";
import { TablespaceOptionContext } from "./MySQLParser.js";
import { TsOptionInitialSizeContext } from "./MySQLParser.js";
import { TsOptionUndoRedoBufferSizeContext } from "./MySQLParser.js";
import { TsOptionAutoextendSizeContext } from "./MySQLParser.js";
import { TsOptionMaxSizeContext } from "./MySQLParser.js";
import { TsOptionExtentSizeContext } from "./MySQLParser.js";
import { TsOptionNodegroupContext } from "./MySQLParser.js";
import { TsOptionEngineContext } from "./MySQLParser.js";
import { TsOptionWaitContext } from "./MySQLParser.js";
import { TsOptionCommentContext } from "./MySQLParser.js";
import { TsOptionFileblockSizeContext } from "./MySQLParser.js";
import { TsOptionEncryptionContext } from "./MySQLParser.js";
import { TsOptionEngineAttributeContext } from "./MySQLParser.js";
import { CreateViewContext } from "./MySQLParser.js";
import { ViewReplaceOrAlgorithmContext } from "./MySQLParser.js";
import { ViewAlgorithmContext } from "./MySQLParser.js";
import { ViewSuidContext } from "./MySQLParser.js";
import { CreateTriggerContext } from "./MySQLParser.js";
import { TriggerFollowsPrecedesClauseContext } from "./MySQLParser.js";
import { CreateEventContext } from "./MySQLParser.js";
import { CreateRoleContext } from "./MySQLParser.js";
import { CreateSpatialReferenceContext } from "./MySQLParser.js";
import { SrsAttributeContext } from "./MySQLParser.js";
import { DropStatementContext } from "./MySQLParser.js";
import { DropDatabaseContext } from "./MySQLParser.js";
import { DropEventContext } from "./MySQLParser.js";
import { DropFunctionContext } from "./MySQLParser.js";
import { DropProcedureContext } from "./MySQLParser.js";
import { DropIndexContext } from "./MySQLParser.js";
import { DropLogfileGroupContext } from "./MySQLParser.js";
import { DropLogfileGroupOptionContext } from "./MySQLParser.js";
import { DropServerContext } from "./MySQLParser.js";
import { DropTableContext } from "./MySQLParser.js";
import { DropTableSpaceContext } from "./MySQLParser.js";
import { DropTriggerContext } from "./MySQLParser.js";
import { DropViewContext } from "./MySQLParser.js";
import { DropRoleContext } from "./MySQLParser.js";
import { DropSpatialReferenceContext } from "./MySQLParser.js";
import { DropUndoTablespaceContext } from "./MySQLParser.js";
import { RenameTableStatementContext } from "./MySQLParser.js";
import { RenamePairContext } from "./MySQLParser.js";
import { TruncateTableStatementContext } from "./MySQLParser.js";
import { ImportStatementContext } from "./MySQLParser.js";
import { CallStatementContext } from "./MySQLParser.js";
import { DeleteStatementContext } from "./MySQLParser.js";
import { PartitionDeleteContext } from "./MySQLParser.js";
import { DeleteStatementOptionContext } from "./MySQLParser.js";
import { DoStatementContext } from "./MySQLParser.js";
import { HandlerStatementContext } from "./MySQLParser.js";
import { HandlerReadOrScanContext } from "./MySQLParser.js";
import { InsertStatementContext } from "./MySQLParser.js";
import { InsertLockOptionContext } from "./MySQLParser.js";
import { InsertFromConstructorContext } from "./MySQLParser.js";
import { FieldsContext } from "./MySQLParser.js";
import { InsertValuesContext } from "./MySQLParser.js";
import { InsertQueryExpressionContext } from "./MySQLParser.js";
import { ValueListContext } from "./MySQLParser.js";
import { ValuesContext } from "./MySQLParser.js";
import { ValuesReferenceContext } from "./MySQLParser.js";
import { InsertUpdateListContext } from "./MySQLParser.js";
import { LoadStatementContext } from "./MySQLParser.js";
import { DataOrXmlContext } from "./MySQLParser.js";
import { XmlRowsIdentifiedByContext } from "./MySQLParser.js";
import { LoadDataFileTailContext } from "./MySQLParser.js";
import { LoadDataFileTargetListContext } from "./MySQLParser.js";
import { FieldOrVariableListContext } from "./MySQLParser.js";
import { ReplaceStatementContext } from "./MySQLParser.js";
import { SelectStatementContext } from "./MySQLParser.js";
import { SelectStatementWithIntoContext } from "./MySQLParser.js";
import { QueryExpressionContext } from "./MySQLParser.js";
import { QueryExpressionBodyContext } from "./MySQLParser.js";
import { QueryExpressionParensContext } from "./MySQLParser.js";
import { QueryPrimaryContext } from "./MySQLParser.js";
import { QuerySpecificationContext } from "./MySQLParser.js";
import { SubqueryContext } from "./MySQLParser.js";
import { QuerySpecOptionContext } from "./MySQLParser.js";
import { LimitClauseContext } from "./MySQLParser.js";
import { SimpleLimitClauseContext } from "./MySQLParser.js";
import { LimitOptionsContext } from "./MySQLParser.js";
import { LimitOptionContext } from "./MySQLParser.js";
import { IntoClauseContext } from "./MySQLParser.js";
import { ProcedureAnalyseClauseContext } from "./MySQLParser.js";
import { HavingClauseContext } from "./MySQLParser.js";
import { WindowClauseContext } from "./MySQLParser.js";
import { WindowDefinitionContext } from "./MySQLParser.js";
import { WindowSpecContext } from "./MySQLParser.js";
import { WindowSpecDetailsContext } from "./MySQLParser.js";
import { WindowFrameClauseContext } from "./MySQLParser.js";
import { WindowFrameUnitsContext } from "./MySQLParser.js";
import { WindowFrameExtentContext } from "./MySQLParser.js";
import { WindowFrameStartContext } from "./MySQLParser.js";
import { WindowFrameBetweenContext } from "./MySQLParser.js";
import { WindowFrameBoundContext } from "./MySQLParser.js";
import { WindowFrameExclusionContext } from "./MySQLParser.js";
import { WithClauseContext } from "./MySQLParser.js";
import { CommonTableExpressionContext } from "./MySQLParser.js";
import { GroupByClauseContext } from "./MySQLParser.js";
import { OlapOptionContext } from "./MySQLParser.js";
import { OrderClauseContext } from "./MySQLParser.js";
import { DirectionContext } from "./MySQLParser.js";
import { FromClauseContext } from "./MySQLParser.js";
import { TableReferenceListContext } from "./MySQLParser.js";
import { TableValueConstructorContext } from "./MySQLParser.js";
import { ExplicitTableContext } from "./MySQLParser.js";
import { RowValueExplicitContext } from "./MySQLParser.js";
import { SelectOptionContext } from "./MySQLParser.js";
import { LockingClauseListContext } from "./MySQLParser.js";
import { LockingClauseContext } from "./MySQLParser.js";
import { LockStrenghContext } from "./MySQLParser.js";
import { LockedRowActionContext } from "./MySQLParser.js";
import { SelectItemListContext } from "./MySQLParser.js";
import { SelectItemContext } from "./MySQLParser.js";
import { SelectAliasContext } from "./MySQLParser.js";
import { WhereClauseContext } from "./MySQLParser.js";
import { TableReferenceContext } from "./MySQLParser.js";
import { EscapedTableReferenceContext } from "./MySQLParser.js";
import { JoinedTableContext } from "./MySQLParser.js";
import { NaturalJoinTypeContext } from "./MySQLParser.js";
import { InnerJoinTypeContext } from "./MySQLParser.js";
import { OuterJoinTypeContext } from "./MySQLParser.js";
import { TableFactorContext } from "./MySQLParser.js";
import { SingleTableContext } from "./MySQLParser.js";
import { SingleTableParensContext } from "./MySQLParser.js";
import { DerivedTableContext } from "./MySQLParser.js";
import { TableReferenceListParensContext } from "./MySQLParser.js";
import { TableFunctionContext } from "./MySQLParser.js";
import { ColumnsClauseContext } from "./MySQLParser.js";
import { JtColumnContext } from "./MySQLParser.js";
import { OnEmptyOrErrorContext } from "./MySQLParser.js";
import { OnEmptyOrErrorJsonTableContext } from "./MySQLParser.js";
import { OnEmptyContext } from "./MySQLParser.js";
import { OnErrorContext } from "./MySQLParser.js";
import { JsonOnResponseContext } from "./MySQLParser.js";
import { UnionOptionContext } from "./MySQLParser.js";
import { TableAliasContext } from "./MySQLParser.js";
import { IndexHintListContext } from "./MySQLParser.js";
import { IndexHintContext } from "./MySQLParser.js";
import { IndexHintTypeContext } from "./MySQLParser.js";
import { KeyOrIndexContext } from "./MySQLParser.js";
import { ConstraintKeyTypeContext } from "./MySQLParser.js";
import { IndexHintClauseContext } from "./MySQLParser.js";
import { IndexListContext } from "./MySQLParser.js";
import { IndexListElementContext } from "./MySQLParser.js";
import { UpdateStatementContext } from "./MySQLParser.js";
import { TransactionOrLockingStatementContext } from "./MySQLParser.js";
import { TransactionStatementContext } from "./MySQLParser.js";
import { BeginWorkContext } from "./MySQLParser.js";
import { StartTransactionOptionListContext } from "./MySQLParser.js";
import { SavepointStatementContext } from "./MySQLParser.js";
import { LockStatementContext } from "./MySQLParser.js";
import { LockItemContext } from "./MySQLParser.js";
import { LockOptionContext } from "./MySQLParser.js";
import { XaStatementContext } from "./MySQLParser.js";
import { XaConvertContext } from "./MySQLParser.js";
import { XidContext } from "./MySQLParser.js";
import { ReplicationStatementContext } from "./MySQLParser.js";
import { ResetOptionContext } from "./MySQLParser.js";
import { SourceResetOptionsContext } from "./MySQLParser.js";
import { ReplicationLoadContext } from "./MySQLParser.js";
import { ChangeReplicationSourceContext } from "./MySQLParser.js";
import { ChangeSourceContext } from "./MySQLParser.js";
import { SourceDefinitionsContext } from "./MySQLParser.js";
import { SourceDefinitionContext } from "./MySQLParser.js";
import { ChangeReplicationSourceAutoPositionContext } from "./MySQLParser.js";
import { ChangeReplicationSourceHostContext } from "./MySQLParser.js";
import { ChangeReplicationSourceBindContext } from "./MySQLParser.js";
import { ChangeReplicationSourceUserContext } from "./MySQLParser.js";
import { ChangeReplicationSourcePasswordContext } from "./MySQLParser.js";
import { ChangeReplicationSourcePortContext } from "./MySQLParser.js";
import { ChangeReplicationSourceConnectRetryContext } from "./MySQLParser.js";
import { ChangeReplicationSourceRetryCountContext } from "./MySQLParser.js";
import { ChangeReplicationSourceDelayContext } from "./MySQLParser.js";
import { ChangeReplicationSourceSSLContext } from "./MySQLParser.js";
import { ChangeReplicationSourceSSLCAContext } from "./MySQLParser.js";
import { ChangeReplicationSourceSSLCApathContext } from "./MySQLParser.js";
import { ChangeReplicationSourceSSLCipherContext } from "./MySQLParser.js";
import { ChangeReplicationSourceSSLCLRContext } from "./MySQLParser.js";
import { ChangeReplicationSourceSSLCLRpathContext } from "./MySQLParser.js";
import { ChangeReplicationSourceSSLKeyContext } from "./MySQLParser.js";
import { ChangeReplicationSourceSSLVerifyServerCertContext } from "./MySQLParser.js";
import { ChangeReplicationSourceTLSVersionContext } from "./MySQLParser.js";
import { ChangeReplicationSourceTLSCiphersuitesContext } from "./MySQLParser.js";
import { ChangeReplicationSourceSSLCertContext } from "./MySQLParser.js";
import { ChangeReplicationSourcePublicKeyContext } from "./MySQLParser.js";
import { ChangeReplicationSourceGetSourcePublicKeyContext } from "./MySQLParser.js";
import { ChangeReplicationSourceHeartbeatPeriodContext } from "./MySQLParser.js";
import { ChangeReplicationSourceCompressionAlgorithmContext } from "./MySQLParser.js";
import { ChangeReplicationSourceZstdCompressionLevelContext } from "./MySQLParser.js";
import { PrivilegeCheckDefContext } from "./MySQLParser.js";
import { TablePrimaryKeyCheckDefContext } from "./MySQLParser.js";
import { AssignGtidsToAnonymousTransactionsDefinitionContext } from "./MySQLParser.js";
import { SourceTlsCiphersuitesDefContext } from "./MySQLParser.js";
import { SourceFileDefContext } from "./MySQLParser.js";
import { SourceLogFileContext } from "./MySQLParser.js";
import { SourceLogPosContext } from "./MySQLParser.js";
import { ServerIdListContext } from "./MySQLParser.js";
import { ChangeReplicationContext } from "./MySQLParser.js";
import { FilterDefinitionContext } from "./MySQLParser.js";
import { FilterDbListContext } from "./MySQLParser.js";
import { FilterTableListContext } from "./MySQLParser.js";
import { FilterStringListContext } from "./MySQLParser.js";
import { FilterWildDbTableStringContext } from "./MySQLParser.js";
import { FilterDbPairListContext } from "./MySQLParser.js";
import { StartReplicaStatementContext } from "./MySQLParser.js";
import { StopReplicaStatementContext } from "./MySQLParser.js";
import { ReplicaUntilContext } from "./MySQLParser.js";
import { UserOptionContext } from "./MySQLParser.js";
import { PasswordOptionContext } from "./MySQLParser.js";
import { DefaultAuthOptionContext } from "./MySQLParser.js";
import { PluginDirOptionContext } from "./MySQLParser.js";
import { ReplicaThreadOptionsContext } from "./MySQLParser.js";
import { ReplicaThreadOptionContext } from "./MySQLParser.js";
import { GroupReplicationContext } from "./MySQLParser.js";
import { GroupReplicationStartOptionsContext } from "./MySQLParser.js";
import { GroupReplicationStartOptionContext } from "./MySQLParser.js";
import { GroupReplicationUserContext } from "./MySQLParser.js";
import { GroupReplicationPasswordContext } from "./MySQLParser.js";
import { GroupReplicationPluginAuthContext } from "./MySQLParser.js";
import { ReplicaContext } from "./MySQLParser.js";
import { PreparedStatementContext } from "./MySQLParser.js";
import { ExecuteStatementContext } from "./MySQLParser.js";
import { ExecuteVarListContext } from "./MySQLParser.js";
import { CloneStatementContext } from "./MySQLParser.js";
import { DataDirSSLContext } from "./MySQLParser.js";
import { SslContext } from "./MySQLParser.js";
import { AccountManagementStatementContext } from "./MySQLParser.js";
import { AlterUserStatementContext } from "./MySQLParser.js";
import { AlterUserListContext } from "./MySQLParser.js";
import { AlterUserContext } from "./MySQLParser.js";
import { OldAlterUserContext } from "./MySQLParser.js";
import { UserFunctionContext } from "./MySQLParser.js";
import { CreateUserStatementContext } from "./MySQLParser.js";
import { CreateUserTailContext } from "./MySQLParser.js";
import { UserAttributesContext } from "./MySQLParser.js";
import { DefaultRoleClauseContext } from "./MySQLParser.js";
import { RequireClauseContext } from "./MySQLParser.js";
import { ConnectOptionsContext } from "./MySQLParser.js";
import { AccountLockPasswordExpireOptionsContext } from "./MySQLParser.js";
import { UserAttributeContext } from "./MySQLParser.js";
import { DropUserStatementContext } from "./MySQLParser.js";
import { GrantStatementContext } from "./MySQLParser.js";
import { GrantTargetListContext } from "./MySQLParser.js";
import { GrantOptionsContext } from "./MySQLParser.js";
import { ExceptRoleListContext } from "./MySQLParser.js";
import { WithRolesContext } from "./MySQLParser.js";
import { GrantAsContext } from "./MySQLParser.js";
import { VersionedRequireClauseContext } from "./MySQLParser.js";
import { RenameUserStatementContext } from "./MySQLParser.js";
import { RevokeStatementContext } from "./MySQLParser.js";
import { AclTypeContext } from "./MySQLParser.js";
import { RoleOrPrivilegesListContext } from "./MySQLParser.js";
import { RoleOrPrivilegeContext } from "./MySQLParser.js";
import { GrantIdentifierContext } from "./MySQLParser.js";
import { RequireListContext } from "./MySQLParser.js";
import { RequireListElementContext } from "./MySQLParser.js";
import { GrantOptionContext } from "./MySQLParser.js";
import { SetRoleStatementContext } from "./MySQLParser.js";
import { RoleListContext } from "./MySQLParser.js";
import { RoleContext } from "./MySQLParser.js";
import { TableAdministrationStatementContext } from "./MySQLParser.js";
import { HistogramContext } from "./MySQLParser.js";
import { CheckOptionContext } from "./MySQLParser.js";
import { RepairTypeContext } from "./MySQLParser.js";
import { InstallUninstallStatementContext } from "./MySQLParser.js";
import { SetStatementContext } from "./MySQLParser.js";
import { StartOptionValueListContext } from "./MySQLParser.js";
import { TransactionCharacteristicsContext } from "./MySQLParser.js";
import { TransactionAccessModeContext } from "./MySQLParser.js";
import { IsolationLevelContext } from "./MySQLParser.js";
import { OptionValueListContinuedContext } from "./MySQLParser.js";
import { OptionValueNoOptionTypeContext } from "./MySQLParser.js";
import { OptionValueContext } from "./MySQLParser.js";
import { SetSystemVariableContext } from "./MySQLParser.js";
import { StartOptionValueListFollowingOptionTypeContext } from "./MySQLParser.js";
import { OptionValueFollowingOptionTypeContext } from "./MySQLParser.js";
import { SetExprOrDefaultContext } from "./MySQLParser.js";
import { ShowDatabasesStatementContext } from "./MySQLParser.js";
import { ShowTablesStatementContext } from "./MySQLParser.js";
import { ShowTriggersStatementContext } from "./MySQLParser.js";
import { ShowEventsStatementContext } from "./MySQLParser.js";
import { ShowTableStatusStatementContext } from "./MySQLParser.js";
import { ShowOpenTablesStatementContext } from "./MySQLParser.js";
import { ShowPluginsStatementContext } from "./MySQLParser.js";
import { ShowEngineLogsStatementContext } from "./MySQLParser.js";
import { ShowEngineMutexStatementContext } from "./MySQLParser.js";
import { ShowEngineStatusStatementContext } from "./MySQLParser.js";
import { ShowColumnsStatementContext } from "./MySQLParser.js";
import { ShowBinaryLogsStatementContext } from "./MySQLParser.js";
import { ShowReplicasStatementContext } from "./MySQLParser.js";
import { ShowBinlogEventsStatementContext } from "./MySQLParser.js";
import { ShowRelaylogEventsStatementContext } from "./MySQLParser.js";
import { ShowKeysStatementContext } from "./MySQLParser.js";
import { ShowEnginesStatementContext } from "./MySQLParser.js";
import { ShowCountWarningsStatementContext } from "./MySQLParser.js";
import { ShowCountErrorsStatementContext } from "./MySQLParser.js";
import { ShowWarningsStatementContext } from "./MySQLParser.js";
import { ShowErrorsStatementContext } from "./MySQLParser.js";
import { ShowProfilesStatementContext } from "./MySQLParser.js";
import { ShowProfileStatementContext } from "./MySQLParser.js";
import { ShowStatusStatementContext } from "./MySQLParser.js";
import { ShowProcessListStatementContext } from "./MySQLParser.js";
import { ShowVariablesStatementContext } from "./MySQLParser.js";
import { ShowCharacterSetStatementContext } from "./MySQLParser.js";
import { ShowCollationStatementContext } from "./MySQLParser.js";
import { ShowPrivilegesStatementContext } from "./MySQLParser.js";
import { ShowGrantsStatementContext } from "./MySQLParser.js";
import { ShowCreateDatabaseStatementContext } from "./MySQLParser.js";
import { ShowCreateTableStatementContext } from "./MySQLParser.js";
import { ShowCreateViewStatementContext } from "./MySQLParser.js";
import { ShowMasterStatusStatementContext } from "./MySQLParser.js";
import { ShowReplicaStatusStatementContext } from "./MySQLParser.js";
import { ShowCreateProcedureStatementContext } from "./MySQLParser.js";
import { ShowCreateFunctionStatementContext } from "./MySQLParser.js";
import { ShowCreateTriggerStatementContext } from "./MySQLParser.js";
import { ShowCreateProcedureStatusStatementContext } from "./MySQLParser.js";
import { ShowCreateFunctionStatusStatementContext } from "./MySQLParser.js";
import { ShowCreateProcedureCodeStatementContext } from "./MySQLParser.js";
import { ShowCreateFunctionCodeStatementContext } from "./MySQLParser.js";
import { ShowCreateEventStatementContext } from "./MySQLParser.js";
import { ShowCreateUserStatementContext } from "./MySQLParser.js";
import { ShowCommandTypeContext } from "./MySQLParser.js";
import { EngineOrAllContext } from "./MySQLParser.js";
import { FromOrInContext } from "./MySQLParser.js";
import { InDbContext } from "./MySQLParser.js";
import { ProfileDefinitionsContext } from "./MySQLParser.js";
import { ProfileDefinitionContext } from "./MySQLParser.js";
import { OtherAdministrativeStatementContext } from "./MySQLParser.js";
import { KeyCacheListOrPartsContext } from "./MySQLParser.js";
import { KeyCacheListContext } from "./MySQLParser.js";
import { AssignToKeycacheContext } from "./MySQLParser.js";
import { AssignToKeycachePartitionContext } from "./MySQLParser.js";
import { CacheKeyListContext } from "./MySQLParser.js";
import { KeyUsageElementContext } from "./MySQLParser.js";
import { KeyUsageListContext } from "./MySQLParser.js";
import { FlushOptionContext } from "./MySQLParser.js";
import { LogTypeContext } from "./MySQLParser.js";
import { FlushTablesContext } from "./MySQLParser.js";
import { FlushTablesOptionsContext } from "./MySQLParser.js";
import { PreloadTailContext } from "./MySQLParser.js";
import { PreloadListContext } from "./MySQLParser.js";
import { PreloadKeysContext } from "./MySQLParser.js";
import { AdminPartitionContext } from "./MySQLParser.js";
import { ResourceGroupManagementContext } from "./MySQLParser.js";
import { CreateResourceGroupContext } from "./MySQLParser.js";
import { ResourceGroupVcpuListContext } from "./MySQLParser.js";
import { VcpuNumOrRangeContext } from "./MySQLParser.js";
import { ResourceGroupPriorityContext } from "./MySQLParser.js";
import { ResourceGroupEnableDisableContext } from "./MySQLParser.js";
import { AlterResourceGroupContext } from "./MySQLParser.js";
import { SetResourceGroupContext } from "./MySQLParser.js";
import { ThreadIdListContext } from "./MySQLParser.js";
import { DropResourceGroupContext } from "./MySQLParser.js";
import { UtilityStatementContext } from "./MySQLParser.js";
import { DescribeStatementContext } from "./MySQLParser.js";
import { ExplainStatementContext } from "./MySQLParser.js";
import { ExplainableStatementContext } from "./MySQLParser.js";
import { HelpCommandContext } from "./MySQLParser.js";
import { UseCommandContext } from "./MySQLParser.js";
import { RestartServerContext } from "./MySQLParser.js";
import { ExprOrContext } from "./MySQLParser.js";
import { ExprNotContext } from "./MySQLParser.js";
import { ExprIsContext } from "./MySQLParser.js";
import { ExprAndContext } from "./MySQLParser.js";
import { ExprXorContext } from "./MySQLParser.js";
import { PrimaryExprPredicateContext } from "./MySQLParser.js";
import { PrimaryExprCompareContext } from "./MySQLParser.js";
import { PrimaryExprAllAnyContext } from "./MySQLParser.js";
import { PrimaryExprIsNullContext } from "./MySQLParser.js";
import { CompOpContext } from "./MySQLParser.js";
import { PredicateContext } from "./MySQLParser.js";
import { PredicateExprInContext } from "./MySQLParser.js";
import { PredicateExprBetweenContext } from "./MySQLParser.js";
import { PredicateExprLikeContext } from "./MySQLParser.js";
import { PredicateExprRegexContext } from "./MySQLParser.js";
import { BitExprContext } from "./MySQLParser.js";
import { SimpleExprConvertContext } from "./MySQLParser.js";
import { SimpleExprCastContext } from "./MySQLParser.js";
import { SimpleExprUnaryContext } from "./MySQLParser.js";
import { SimpleExpressionRValueContext } from "./MySQLParser.js";
import { SimpleExprOdbcContext } from "./MySQLParser.js";
import { SimpleExprRuntimeFunctionContext } from "./MySQLParser.js";
import { SimpleExprFunctionContext } from "./MySQLParser.js";
import { SimpleExprCollateContext } from "./MySQLParser.js";
import { SimpleExprMatchContext } from "./MySQLParser.js";
import { SimpleExprWindowingFunctionContext } from "./MySQLParser.js";
import { SimpleExprBinaryContext } from "./MySQLParser.js";
import { SimpleExprColumnRefContext } from "./MySQLParser.js";
import { SimpleExprParamMarkerContext } from "./MySQLParser.js";
import { SimpleExprSumContext } from "./MySQLParser.js";
import { SimpleExprCastTimeContext } from "./MySQLParser.js";
import { SimpleExprConvertUsingContext } from "./MySQLParser.js";
import { SimpleExprSubQueryContext } from "./MySQLParser.js";
import { SimpleExprGroupingOperationContext } from "./MySQLParser.js";
import { SimpleExprNotContext } from "./MySQLParser.js";
import { SimpleExprValuesContext } from "./MySQLParser.js";
import { SimpleExprUserVariableAssignmentContext } from "./MySQLParser.js";
import { SimpleExprDefaultContext } from "./MySQLParser.js";
import { SimpleExprListContext } from "./MySQLParser.js";
import { SimpleExprIntervalContext } from "./MySQLParser.js";
import { SimpleExprCaseContext } from "./MySQLParser.js";
import { SimpleExprConcatContext } from "./MySQLParser.js";
import { SimpleExprLiteralContext } from "./MySQLParser.js";
import { ArrayCastContext } from "./MySQLParser.js";
import { JsonOperatorContext } from "./MySQLParser.js";
import { SumExprContext } from "./MySQLParser.js";
import { GroupingOperationContext } from "./MySQLParser.js";
import { WindowFunctionCallContext } from "./MySQLParser.js";
import { WindowingClauseContext } from "./MySQLParser.js";
import { LeadLagInfoContext } from "./MySQLParser.js";
import { StableIntegerContext } from "./MySQLParser.js";
import { ParamOrVarContext } from "./MySQLParser.js";
import { NullTreatmentContext } from "./MySQLParser.js";
import { JsonFunctionContext } from "./MySQLParser.js";
import { InSumExprContext } from "./MySQLParser.js";
import { IdentListArgContext } from "./MySQLParser.js";
import { IdentListContext } from "./MySQLParser.js";
import { FulltextOptionsContext } from "./MySQLParser.js";
import { RuntimeFunctionCallContext } from "./MySQLParser.js";
import { ReturningTypeContext } from "./MySQLParser.js";
import { GeometryFunctionContext } from "./MySQLParser.js";
import { TimeFunctionParametersContext } from "./MySQLParser.js";
import { FractionalPrecisionContext } from "./MySQLParser.js";
import { WeightStringLevelsContext } from "./MySQLParser.js";
import { WeightStringLevelListItemContext } from "./MySQLParser.js";
import { DateTimeTtypeContext } from "./MySQLParser.js";
import { TrimFunctionContext } from "./MySQLParser.js";
import { SubstringFunctionContext } from "./MySQLParser.js";
import { FunctionCallContext } from "./MySQLParser.js";
import { UdfExprListContext } from "./MySQLParser.js";
import { UdfExprContext } from "./MySQLParser.js";
import { UserVariableContext } from "./MySQLParser.js";
import { InExpressionUserVariableAssignmentContext } from "./MySQLParser.js";
import { RvalueSystemOrUserVariableContext } from "./MySQLParser.js";
import { LvalueVariableContext } from "./MySQLParser.js";
import { RvalueSystemVariableContext } from "./MySQLParser.js";
import { WhenExpressionContext } from "./MySQLParser.js";
import { ThenExpressionContext } from "./MySQLParser.js";
import { ElseExpressionContext } from "./MySQLParser.js";
import { CastTypeContext } from "./MySQLParser.js";
import { ExprListContext } from "./MySQLParser.js";
import { CharsetContext } from "./MySQLParser.js";
import { NotRuleContext } from "./MySQLParser.js";
import { Not2RuleContext } from "./MySQLParser.js";
import { IntervalContext } from "./MySQLParser.js";
import { IntervalTimeStampContext } from "./MySQLParser.js";
import { ExprListWithParenthesesContext } from "./MySQLParser.js";
import { ExprWithParenthesesContext } from "./MySQLParser.js";
import { SimpleExprWithParenthesesContext } from "./MySQLParser.js";
import { OrderListContext } from "./MySQLParser.js";
import { OrderExpressionContext } from "./MySQLParser.js";
import { GroupListContext } from "./MySQLParser.js";
import { GroupingExpressionContext } from "./MySQLParser.js";
import { ChannelContext } from "./MySQLParser.js";
import { CompoundStatementContext } from "./MySQLParser.js";
import { ReturnStatementContext } from "./MySQLParser.js";
import { IfStatementContext } from "./MySQLParser.js";
import { IfBodyContext } from "./MySQLParser.js";
import { ThenStatementContext } from "./MySQLParser.js";
import { CompoundStatementListContext } from "./MySQLParser.js";
import { CaseStatementContext } from "./MySQLParser.js";
import { ElseStatementContext } from "./MySQLParser.js";
import { LabeledBlockContext } from "./MySQLParser.js";
import { UnlabeledBlockContext } from "./MySQLParser.js";
import { LabelContext } from "./MySQLParser.js";
import { BeginEndBlockContext } from "./MySQLParser.js";
import { LabeledControlContext } from "./MySQLParser.js";
import { UnlabeledControlContext } from "./MySQLParser.js";
import { LoopBlockContext } from "./MySQLParser.js";
import { WhileDoBlockContext } from "./MySQLParser.js";
import { RepeatUntilBlockContext } from "./MySQLParser.js";
import { SpDeclarationsContext } from "./MySQLParser.js";
import { SpDeclarationContext } from "./MySQLParser.js";
import { VariableDeclarationContext } from "./MySQLParser.js";
import { ConditionDeclarationContext } from "./MySQLParser.js";
import { SpConditionContext } from "./MySQLParser.js";
import { SqlstateContext } from "./MySQLParser.js";
import { HandlerDeclarationContext } from "./MySQLParser.js";
import { HandlerConditionContext } from "./MySQLParser.js";
import { CursorDeclarationContext } from "./MySQLParser.js";
import { IterateStatementContext } from "./MySQLParser.js";
import { LeaveStatementContext } from "./MySQLParser.js";
import { GetDiagnosticsStatementContext } from "./MySQLParser.js";
import { SignalAllowedExprContext } from "./MySQLParser.js";
import { StatementInformationItemContext } from "./MySQLParser.js";
import { ConditionInformationItemContext } from "./MySQLParser.js";
import { SignalInformationItemNameContext } from "./MySQLParser.js";
import { SignalStatementContext } from "./MySQLParser.js";
import { ResignalStatementContext } from "./MySQLParser.js";
import { SignalInformationItemContext } from "./MySQLParser.js";
import { CursorOpenContext } from "./MySQLParser.js";
import { CursorCloseContext } from "./MySQLParser.js";
import { CursorFetchContext } from "./MySQLParser.js";
import { ScheduleContext } from "./MySQLParser.js";
import { ColumnDefinitionContext } from "./MySQLParser.js";
import { CheckOrReferencesContext } from "./MySQLParser.js";
import { CheckConstraintContext } from "./MySQLParser.js";
import { ConstraintEnforcementContext } from "./MySQLParser.js";
import { TableConstraintDefContext } from "./MySQLParser.js";
import { ConstraintNameContext } from "./MySQLParser.js";
import { FieldDefinitionContext } from "./MySQLParser.js";
import { ColumnAttributeContext } from "./MySQLParser.js";
import { ColumnFormatContext } from "./MySQLParser.js";
import { StorageMediaContext } from "./MySQLParser.js";
import { NowContext } from "./MySQLParser.js";
import { NowOrSignedLiteralContext } from "./MySQLParser.js";
import { GcolAttributeContext } from "./MySQLParser.js";
import { ReferencesContext } from "./MySQLParser.js";
import { DeleteOptionContext } from "./MySQLParser.js";
import { KeyListContext } from "./MySQLParser.js";
import { KeyPartContext } from "./MySQLParser.js";
import { KeyListWithExpressionContext } from "./MySQLParser.js";
import { KeyPartOrExpressionContext } from "./MySQLParser.js";
import { IndexTypeContext } from "./MySQLParser.js";
import { IndexOptionContext } from "./MySQLParser.js";
import { CommonIndexOptionContext } from "./MySQLParser.js";
import { VisibilityContext } from "./MySQLParser.js";
import { IndexTypeClauseContext } from "./MySQLParser.js";
import { FulltextIndexOptionContext } from "./MySQLParser.js";
import { SpatialIndexOptionContext } from "./MySQLParser.js";
import { DataTypeDefinitionContext } from "./MySQLParser.js";
import { DataTypeContext } from "./MySQLParser.js";
import { NcharContext } from "./MySQLParser.js";
import { RealTypeContext } from "./MySQLParser.js";
import { FieldLengthContext } from "./MySQLParser.js";
import { FieldOptionsContext } from "./MySQLParser.js";
import { CharsetWithOptBinaryContext } from "./MySQLParser.js";
import { AsciiContext } from "./MySQLParser.js";
import { UnicodeContext } from "./MySQLParser.js";
import { WsNumCodepointsContext } from "./MySQLParser.js";
import { TypeDatetimePrecisionContext } from "./MySQLParser.js";
import { FunctionDatetimePrecisionContext } from "./MySQLParser.js";
import { CharsetNameContext } from "./MySQLParser.js";
import { CollationNameContext } from "./MySQLParser.js";
import { CreateTableOptionsContext } from "./MySQLParser.js";
import { CreateTableOptionsEtcContext } from "./MySQLParser.js";
import { CreatePartitioningEtcContext } from "./MySQLParser.js";
import { CreateTableOptionsSpaceSeparatedContext } from "./MySQLParser.js";
import { CreateTableOptionContext } from "./MySQLParser.js";
import { TernaryOptionContext } from "./MySQLParser.js";
import { DefaultCollationContext } from "./MySQLParser.js";
import { DefaultEncryptionContext } from "./MySQLParser.js";
import { DefaultCharsetContext } from "./MySQLParser.js";
import { PartitionClauseContext } from "./MySQLParser.js";
import { PartitionDefKeyContext } from "./MySQLParser.js";
import { PartitionDefHashContext } from "./MySQLParser.js";
import { PartitionDefRangeListContext } from "./MySQLParser.js";
import { SubPartitionsContext } from "./MySQLParser.js";
import { PartitionKeyAlgorithmContext } from "./MySQLParser.js";
import { PartitionDefinitionsContext } from "./MySQLParser.js";
import { PartitionDefinitionContext } from "./MySQLParser.js";
import { PartitionValuesInContext } from "./MySQLParser.js";
import { PartitionOptionContext } from "./MySQLParser.js";
import { SubpartitionDefinitionContext } from "./MySQLParser.js";
import { PartitionValueItemListParenContext } from "./MySQLParser.js";
import { PartitionValueItemContext } from "./MySQLParser.js";
import { DefinerClauseContext } from "./MySQLParser.js";
import { IfExistsContext } from "./MySQLParser.js";
import { IfNotExistsContext } from "./MySQLParser.js";
import { IgnoreUnknownUserContext } from "./MySQLParser.js";
import { ProcedureParameterContext } from "./MySQLParser.js";
import { FunctionParameterContext } from "./MySQLParser.js";
import { CollateContext } from "./MySQLParser.js";
import { TypeWithOptCollateContext } from "./MySQLParser.js";
import { SchemaIdentifierPairContext } from "./MySQLParser.js";
import { ViewRefListContext } from "./MySQLParser.js";
import { UpdateListContext } from "./MySQLParser.js";
import { UpdateElementContext } from "./MySQLParser.js";
import { CharsetClauseContext } from "./MySQLParser.js";
import { FieldsClauseContext } from "./MySQLParser.js";
import { FieldTermContext } from "./MySQLParser.js";
import { LinesClauseContext } from "./MySQLParser.js";
import { LineTermContext } from "./MySQLParser.js";
import { UserListContext } from "./MySQLParser.js";
import { CreateUserListContext } from "./MySQLParser.js";
import { CreateUserContext } from "./MySQLParser.js";
import { CreateUserWithMfaContext } from "./MySQLParser.js";
import { IdentificationContext } from "./MySQLParser.js";
import { IdentifiedByPasswordContext } from "./MySQLParser.js";
import { IdentifiedByRandomPasswordContext } from "./MySQLParser.js";
import { IdentifiedWithPluginContext } from "./MySQLParser.js";
import { IdentifiedWithPluginAsAuthContext } from "./MySQLParser.js";
import { IdentifiedWithPluginByPasswordContext } from "./MySQLParser.js";
import { IdentifiedWithPluginByRandomPasswordContext } from "./MySQLParser.js";
import { InitialAuthContext } from "./MySQLParser.js";
import { RetainCurrentPasswordContext } from "./MySQLParser.js";
import { DiscardOldPasswordContext } from "./MySQLParser.js";
import { UserRegistrationContext } from "./MySQLParser.js";
import { FactorContext } from "./MySQLParser.js";
import { ReplacePasswordContext } from "./MySQLParser.js";
import { UserIdentifierOrTextContext } from "./MySQLParser.js";
import { UserContext } from "./MySQLParser.js";
import { LikeClauseContext } from "./MySQLParser.js";
import { LikeOrWhereContext } from "./MySQLParser.js";
import { OnlineOptionContext } from "./MySQLParser.js";
import { NoWriteToBinLogContext } from "./MySQLParser.js";
import { UsePartitionContext } from "./MySQLParser.js";
import { FieldIdentifierContext } from "./MySQLParser.js";
import { ColumnNameContext } from "./MySQLParser.js";
import { ColumnInternalRefContext } from "./MySQLParser.js";
import { ColumnInternalRefListContext } from "./MySQLParser.js";
import { ColumnRefContext } from "./MySQLParser.js";
import { InsertIdentifierContext } from "./MySQLParser.js";
import { IndexNameContext } from "./MySQLParser.js";
import { IndexRefContext } from "./MySQLParser.js";
import { TableWildContext } from "./MySQLParser.js";
import { SchemaNameContext } from "./MySQLParser.js";
import { SchemaRefContext } from "./MySQLParser.js";
import { ProcedureNameContext } from "./MySQLParser.js";
import { ProcedureRefContext } from "./MySQLParser.js";
import { FunctionNameContext } from "./MySQLParser.js";
import { FunctionRefContext } from "./MySQLParser.js";
import { TriggerNameContext } from "./MySQLParser.js";
import { TriggerRefContext } from "./MySQLParser.js";
import { ViewNameContext } from "./MySQLParser.js";
import { ViewRefContext } from "./MySQLParser.js";
import { TablespaceNameContext } from "./MySQLParser.js";
import { TablespaceRefContext } from "./MySQLParser.js";
import { LogfileGroupNameContext } from "./MySQLParser.js";
import { LogfileGroupRefContext } from "./MySQLParser.js";
import { EventNameContext } from "./MySQLParser.js";
import { EventRefContext } from "./MySQLParser.js";
import { UdfNameContext } from "./MySQLParser.js";
import { ServerNameContext } from "./MySQLParser.js";
import { ServerRefContext } from "./MySQLParser.js";
import { EngineRefContext } from "./MySQLParser.js";
import { TableNameContext } from "./MySQLParser.js";
import { FilterTableRefContext } from "./MySQLParser.js";
import { TableRefWithWildcardContext } from "./MySQLParser.js";
import { TableRefContext } from "./MySQLParser.js";
import { TableRefListContext } from "./MySQLParser.js";
import { TableAliasRefListContext } from "./MySQLParser.js";
import { ParameterNameContext } from "./MySQLParser.js";
import { LabelIdentifierContext } from "./MySQLParser.js";
import { LabelRefContext } from "./MySQLParser.js";
import { RoleIdentifierContext } from "./MySQLParser.js";
import { PluginRefContext } from "./MySQLParser.js";
import { ComponentRefContext } from "./MySQLParser.js";
import { ResourceGroupRefContext } from "./MySQLParser.js";
import { WindowNameContext } from "./MySQLParser.js";
import { PureIdentifierContext } from "./MySQLParser.js";
import { IdentifierContext } from "./MySQLParser.js";
import { IdentifierListContext } from "./MySQLParser.js";
import { IdentifierListWithParenthesesContext } from "./MySQLParser.js";
import { QualifiedIdentifierContext } from "./MySQLParser.js";
import { SimpleIdentifierContext } from "./MySQLParser.js";
import { DotIdentifierContext } from "./MySQLParser.js";
import { Ulong_numberContext } from "./MySQLParser.js";
import { Real_ulong_numberContext } from "./MySQLParser.js";
import { Ulonglong_numberContext } from "./MySQLParser.js";
import { Real_ulonglong_numberContext } from "./MySQLParser.js";
import { SignedLiteralContext } from "./MySQLParser.js";
import { SignedLiteralOrNullContext } from "./MySQLParser.js";
import { LiteralContext } from "./MySQLParser.js";
import { LiteralOrNullContext } from "./MySQLParser.js";
import { NullAsLiteralContext } from "./MySQLParser.js";
import { StringListContext } from "./MySQLParser.js";
import { TextStringLiteralContext } from "./MySQLParser.js";
import { TextStringContext } from "./MySQLParser.js";
import { TextStringHashContext } from "./MySQLParser.js";
import { TextLiteralContext } from "./MySQLParser.js";
import { TextStringNoLinebreakContext } from "./MySQLParser.js";
import { TextStringLiteralListContext } from "./MySQLParser.js";
import { NumLiteralContext } from "./MySQLParser.js";
import { BoolLiteralContext } from "./MySQLParser.js";
import { NullLiteralContext } from "./MySQLParser.js";
import { Int64LiteralContext } from "./MySQLParser.js";
import { TemporalLiteralContext } from "./MySQLParser.js";
import { FloatOptionsContext } from "./MySQLParser.js";
import { StandardFloatOptionsContext } from "./MySQLParser.js";
import { PrecisionContext } from "./MySQLParser.js";
import { TextOrIdentifierContext } from "./MySQLParser.js";
import { LValueIdentifierContext } from "./MySQLParser.js";
import { RoleIdentifierOrTextContext } from "./MySQLParser.js";
import { SizeNumberContext } from "./MySQLParser.js";
import { ParenthesesContext } from "./MySQLParser.js";
import { EqualContext } from "./MySQLParser.js";
import { OptionTypeContext } from "./MySQLParser.js";
import { RvalueSystemVariableTypeContext } from "./MySQLParser.js";
import { SetVarIdentTypeContext } from "./MySQLParser.js";
import { JsonAttributeContext } from "./MySQLParser.js";
import { IdentifierKeywordContext } from "./MySQLParser.js";
import { IdentifierKeywordsAmbiguous1RolesAndLabelsContext } from "./MySQLParser.js";
import { IdentifierKeywordsAmbiguous2LabelsContext } from "./MySQLParser.js";
import { LabelKeywordContext } from "./MySQLParser.js";
import { IdentifierKeywordsAmbiguous3RolesContext } from "./MySQLParser.js";
import { IdentifierKeywordsUnambiguousContext } from "./MySQLParser.js";
import { RoleKeywordContext } from "./MySQLParser.js";
import { LValueKeywordContext } from "./MySQLParser.js";
import { IdentifierKeywordsAmbiguous4SystemVariablesContext } from "./MySQLParser.js";
import { RoleOrIdentifierKeywordContext } from "./MySQLParser.js";
import { RoleOrLabelKeywordContext } from "./MySQLParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `MySQLParser`.
 */
export class MySQLParserListener extends ParseTreeListener {
    /**
     * Enter a parse tree produced by `MySQLParser.query`.
     * @param ctx the parse tree
     */
    enterQuery?: (ctx: QueryContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.query`.
     * @param ctx the parse tree
     */
    exitQuery?: (ctx: QueryContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.simpleStatement`.
     * @param ctx the parse tree
     */
    enterSimpleStatement?: (ctx: SimpleStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.simpleStatement`.
     * @param ctx the parse tree
     */
    exitSimpleStatement?: (ctx: SimpleStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterStatement`.
     * @param ctx the parse tree
     */
    enterAlterStatement?: (ctx: AlterStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterStatement`.
     * @param ctx the parse tree
     */
    exitAlterStatement?: (ctx: AlterStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterDatabase`.
     * @param ctx the parse tree
     */
    enterAlterDatabase?: (ctx: AlterDatabaseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterDatabase`.
     * @param ctx the parse tree
     */
    exitAlterDatabase?: (ctx: AlterDatabaseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterDatabaseOption`.
     * @param ctx the parse tree
     */
    enterAlterDatabaseOption?: (ctx: AlterDatabaseOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterDatabaseOption`.
     * @param ctx the parse tree
     */
    exitAlterDatabaseOption?: (ctx: AlterDatabaseOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterEvent`.
     * @param ctx the parse tree
     */
    enterAlterEvent?: (ctx: AlterEventContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterEvent`.
     * @param ctx the parse tree
     */
    exitAlterEvent?: (ctx: AlterEventContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterLogfileGroup`.
     * @param ctx the parse tree
     */
    enterAlterLogfileGroup?: (ctx: AlterLogfileGroupContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterLogfileGroup`.
     * @param ctx the parse tree
     */
    exitAlterLogfileGroup?: (ctx: AlterLogfileGroupContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterLogfileGroupOptions`.
     * @param ctx the parse tree
     */
    enterAlterLogfileGroupOptions?: (ctx: AlterLogfileGroupOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterLogfileGroupOptions`.
     * @param ctx the parse tree
     */
    exitAlterLogfileGroupOptions?: (ctx: AlterLogfileGroupOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterLogfileGroupOption`.
     * @param ctx the parse tree
     */
    enterAlterLogfileGroupOption?: (ctx: AlterLogfileGroupOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterLogfileGroupOption`.
     * @param ctx the parse tree
     */
    exitAlterLogfileGroupOption?: (ctx: AlterLogfileGroupOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterServer`.
     * @param ctx the parse tree
     */
    enterAlterServer?: (ctx: AlterServerContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterServer`.
     * @param ctx the parse tree
     */
    exitAlterServer?: (ctx: AlterServerContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterTable`.
     * @param ctx the parse tree
     */
    enterAlterTable?: (ctx: AlterTableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterTable`.
     * @param ctx the parse tree
     */
    exitAlterTable?: (ctx: AlterTableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterTableActions`.
     * @param ctx the parse tree
     */
    enterAlterTableActions?: (ctx: AlterTableActionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterTableActions`.
     * @param ctx the parse tree
     */
    exitAlterTableActions?: (ctx: AlterTableActionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterCommandList`.
     * @param ctx the parse tree
     */
    enterAlterCommandList?: (ctx: AlterCommandListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterCommandList`.
     * @param ctx the parse tree
     */
    exitAlterCommandList?: (ctx: AlterCommandListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterCommandsModifierList`.
     * @param ctx the parse tree
     */
    enterAlterCommandsModifierList?: (ctx: AlterCommandsModifierListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterCommandsModifierList`.
     * @param ctx the parse tree
     */
    exitAlterCommandsModifierList?: (ctx: AlterCommandsModifierListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.standaloneAlterCommands`.
     * @param ctx the parse tree
     */
    enterStandaloneAlterCommands?: (ctx: StandaloneAlterCommandsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.standaloneAlterCommands`.
     * @param ctx the parse tree
     */
    exitStandaloneAlterCommands?: (ctx: StandaloneAlterCommandsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterPartition`.
     * @param ctx the parse tree
     */
    enterAlterPartition?: (ctx: AlterPartitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterPartition`.
     * @param ctx the parse tree
     */
    exitAlterPartition?: (ctx: AlterPartitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterList`.
     * @param ctx the parse tree
     */
    enterAlterList?: (ctx: AlterListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterList`.
     * @param ctx the parse tree
     */
    exitAlterList?: (ctx: AlterListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterCommandsModifier`.
     * @param ctx the parse tree
     */
    enterAlterCommandsModifier?: (ctx: AlterCommandsModifierContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterCommandsModifier`.
     * @param ctx the parse tree
     */
    exitAlterCommandsModifier?: (ctx: AlterCommandsModifierContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterListItem`.
     * @param ctx the parse tree
     */
    enterAlterListItem?: (ctx: AlterListItemContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterListItem`.
     * @param ctx the parse tree
     */
    exitAlterListItem?: (ctx: AlterListItemContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.place`.
     * @param ctx the parse tree
     */
    enterPlace?: (ctx: PlaceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.place`.
     * @param ctx the parse tree
     */
    exitPlace?: (ctx: PlaceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.restrict`.
     * @param ctx the parse tree
     */
    enterRestrict?: (ctx: RestrictContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.restrict`.
     * @param ctx the parse tree
     */
    exitRestrict?: (ctx: RestrictContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterOrderList`.
     * @param ctx the parse tree
     */
    enterAlterOrderList?: (ctx: AlterOrderListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterOrderList`.
     * @param ctx the parse tree
     */
    exitAlterOrderList?: (ctx: AlterOrderListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterAlgorithmOption`.
     * @param ctx the parse tree
     */
    enterAlterAlgorithmOption?: (ctx: AlterAlgorithmOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterAlgorithmOption`.
     * @param ctx the parse tree
     */
    exitAlterAlgorithmOption?: (ctx: AlterAlgorithmOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterLockOption`.
     * @param ctx the parse tree
     */
    enterAlterLockOption?: (ctx: AlterLockOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterLockOption`.
     * @param ctx the parse tree
     */
    exitAlterLockOption?: (ctx: AlterLockOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.indexLockAndAlgorithm`.
     * @param ctx the parse tree
     */
    enterIndexLockAndAlgorithm?: (ctx: IndexLockAndAlgorithmContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.indexLockAndAlgorithm`.
     * @param ctx the parse tree
     */
    exitIndexLockAndAlgorithm?: (ctx: IndexLockAndAlgorithmContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.withValidation`.
     * @param ctx the parse tree
     */
    enterWithValidation?: (ctx: WithValidationContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.withValidation`.
     * @param ctx the parse tree
     */
    exitWithValidation?: (ctx: WithValidationContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.removePartitioning`.
     * @param ctx the parse tree
     */
    enterRemovePartitioning?: (ctx: RemovePartitioningContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.removePartitioning`.
     * @param ctx the parse tree
     */
    exitRemovePartitioning?: (ctx: RemovePartitioningContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.allOrPartitionNameList`.
     * @param ctx the parse tree
     */
    enterAllOrPartitionNameList?: (ctx: AllOrPartitionNameListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.allOrPartitionNameList`.
     * @param ctx the parse tree
     */
    exitAllOrPartitionNameList?: (ctx: AllOrPartitionNameListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterTablespace`.
     * @param ctx the parse tree
     */
    enterAlterTablespace?: (ctx: AlterTablespaceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterTablespace`.
     * @param ctx the parse tree
     */
    exitAlterTablespace?: (ctx: AlterTablespaceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterUndoTablespace`.
     * @param ctx the parse tree
     */
    enterAlterUndoTablespace?: (ctx: AlterUndoTablespaceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterUndoTablespace`.
     * @param ctx the parse tree
     */
    exitAlterUndoTablespace?: (ctx: AlterUndoTablespaceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.undoTableSpaceOptions`.
     * @param ctx the parse tree
     */
    enterUndoTableSpaceOptions?: (ctx: UndoTableSpaceOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.undoTableSpaceOptions`.
     * @param ctx the parse tree
     */
    exitUndoTableSpaceOptions?: (ctx: UndoTableSpaceOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.undoTableSpaceOption`.
     * @param ctx the parse tree
     */
    enterUndoTableSpaceOption?: (ctx: UndoTableSpaceOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.undoTableSpaceOption`.
     * @param ctx the parse tree
     */
    exitUndoTableSpaceOption?: (ctx: UndoTableSpaceOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterTablespaceOptions`.
     * @param ctx the parse tree
     */
    enterAlterTablespaceOptions?: (ctx: AlterTablespaceOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterTablespaceOptions`.
     * @param ctx the parse tree
     */
    exitAlterTablespaceOptions?: (ctx: AlterTablespaceOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterTablespaceOption`.
     * @param ctx the parse tree
     */
    enterAlterTablespaceOption?: (ctx: AlterTablespaceOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterTablespaceOption`.
     * @param ctx the parse tree
     */
    exitAlterTablespaceOption?: (ctx: AlterTablespaceOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeTablespaceOption`.
     * @param ctx the parse tree
     */
    enterChangeTablespaceOption?: (ctx: ChangeTablespaceOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeTablespaceOption`.
     * @param ctx the parse tree
     */
    exitChangeTablespaceOption?: (ctx: ChangeTablespaceOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterView`.
     * @param ctx the parse tree
     */
    enterAlterView?: (ctx: AlterViewContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterView`.
     * @param ctx the parse tree
     */
    exitAlterView?: (ctx: AlterViewContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.viewTail`.
     * @param ctx the parse tree
     */
    enterViewTail?: (ctx: ViewTailContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.viewTail`.
     * @param ctx the parse tree
     */
    exitViewTail?: (ctx: ViewTailContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.viewQueryBlock`.
     * @param ctx the parse tree
     */
    enterViewQueryBlock?: (ctx: ViewQueryBlockContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.viewQueryBlock`.
     * @param ctx the parse tree
     */
    exitViewQueryBlock?: (ctx: ViewQueryBlockContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.viewCheckOption`.
     * @param ctx the parse tree
     */
    enterViewCheckOption?: (ctx: ViewCheckOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.viewCheckOption`.
     * @param ctx the parse tree
     */
    exitViewCheckOption?: (ctx: ViewCheckOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterInstanceStatement`.
     * @param ctx the parse tree
     */
    enterAlterInstanceStatement?: (ctx: AlterInstanceStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterInstanceStatement`.
     * @param ctx the parse tree
     */
    exitAlterInstanceStatement?: (ctx: AlterInstanceStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createStatement`.
     * @param ctx the parse tree
     */
    enterCreateStatement?: (ctx: CreateStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createStatement`.
     * @param ctx the parse tree
     */
    exitCreateStatement?: (ctx: CreateStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createDatabase`.
     * @param ctx the parse tree
     */
    enterCreateDatabase?: (ctx: CreateDatabaseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createDatabase`.
     * @param ctx the parse tree
     */
    exitCreateDatabase?: (ctx: CreateDatabaseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createDatabaseOption`.
     * @param ctx the parse tree
     */
    enterCreateDatabaseOption?: (ctx: CreateDatabaseOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createDatabaseOption`.
     * @param ctx the parse tree
     */
    exitCreateDatabaseOption?: (ctx: CreateDatabaseOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createTable`.
     * @param ctx the parse tree
     */
    enterCreateTable?: (ctx: CreateTableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createTable`.
     * @param ctx the parse tree
     */
    exitCreateTable?: (ctx: CreateTableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableElementList`.
     * @param ctx the parse tree
     */
    enterTableElementList?: (ctx: TableElementListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableElementList`.
     * @param ctx the parse tree
     */
    exitTableElementList?: (ctx: TableElementListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableElement`.
     * @param ctx the parse tree
     */
    enterTableElement?: (ctx: TableElementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableElement`.
     * @param ctx the parse tree
     */
    exitTableElement?: (ctx: TableElementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.duplicateAsQe`.
     * @param ctx the parse tree
     */
    enterDuplicateAsQe?: (ctx: DuplicateAsQeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.duplicateAsQe`.
     * @param ctx the parse tree
     */
    exitDuplicateAsQe?: (ctx: DuplicateAsQeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.asCreateQueryExpression`.
     * @param ctx the parse tree
     */
    enterAsCreateQueryExpression?: (ctx: AsCreateQueryExpressionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.asCreateQueryExpression`.
     * @param ctx the parse tree
     */
    exitAsCreateQueryExpression?: (ctx: AsCreateQueryExpressionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.queryExpressionOrParens`.
     * @param ctx the parse tree
     */
    enterQueryExpressionOrParens?: (ctx: QueryExpressionOrParensContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.queryExpressionOrParens`.
     * @param ctx the parse tree
     */
    exitQueryExpressionOrParens?: (ctx: QueryExpressionOrParensContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.queryExpressionWithOptLockingClauses`.
     * @param ctx the parse tree
     */
    enterQueryExpressionWithOptLockingClauses?: (ctx: QueryExpressionWithOptLockingClausesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.queryExpressionWithOptLockingClauses`.
     * @param ctx the parse tree
     */
    exitQueryExpressionWithOptLockingClauses?: (ctx: QueryExpressionWithOptLockingClausesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createRoutine`.
     * @param ctx the parse tree
     */
    enterCreateRoutine?: (ctx: CreateRoutineContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createRoutine`.
     * @param ctx the parse tree
     */
    exitCreateRoutine?: (ctx: CreateRoutineContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createProcedure`.
     * @param ctx the parse tree
     */
    enterCreateProcedure?: (ctx: CreateProcedureContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createProcedure`.
     * @param ctx the parse tree
     */
    exitCreateProcedure?: (ctx: CreateProcedureContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createFunction`.
     * @param ctx the parse tree
     */
    enterCreateFunction?: (ctx: CreateFunctionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createFunction`.
     * @param ctx the parse tree
     */
    exitCreateFunction?: (ctx: CreateFunctionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createUdf`.
     * @param ctx the parse tree
     */
    enterCreateUdf?: (ctx: CreateUdfContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createUdf`.
     * @param ctx the parse tree
     */
    exitCreateUdf?: (ctx: CreateUdfContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.routineCreateOption`.
     * @param ctx the parse tree
     */
    enterRoutineCreateOption?: (ctx: RoutineCreateOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.routineCreateOption`.
     * @param ctx the parse tree
     */
    exitRoutineCreateOption?: (ctx: RoutineCreateOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.routineAlterOptions`.
     * @param ctx the parse tree
     */
    enterRoutineAlterOptions?: (ctx: RoutineAlterOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.routineAlterOptions`.
     * @param ctx the parse tree
     */
    exitRoutineAlterOptions?: (ctx: RoutineAlterOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.routineOption`.
     * @param ctx the parse tree
     */
    enterRoutineOption?: (ctx: RoutineOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.routineOption`.
     * @param ctx the parse tree
     */
    exitRoutineOption?: (ctx: RoutineOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createIndex`.
     * @param ctx the parse tree
     */
    enterCreateIndex?: (ctx: CreateIndexContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createIndex`.
     * @param ctx the parse tree
     */
    exitCreateIndex?: (ctx: CreateIndexContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.indexNameAndType`.
     * @param ctx the parse tree
     */
    enterIndexNameAndType?: (ctx: IndexNameAndTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.indexNameAndType`.
     * @param ctx the parse tree
     */
    exitIndexNameAndType?: (ctx: IndexNameAndTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createIndexTarget`.
     * @param ctx the parse tree
     */
    enterCreateIndexTarget?: (ctx: CreateIndexTargetContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createIndexTarget`.
     * @param ctx the parse tree
     */
    exitCreateIndexTarget?: (ctx: CreateIndexTargetContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createLogfileGroup`.
     * @param ctx the parse tree
     */
    enterCreateLogfileGroup?: (ctx: CreateLogfileGroupContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createLogfileGroup`.
     * @param ctx the parse tree
     */
    exitCreateLogfileGroup?: (ctx: CreateLogfileGroupContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.logfileGroupOptions`.
     * @param ctx the parse tree
     */
    enterLogfileGroupOptions?: (ctx: LogfileGroupOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.logfileGroupOptions`.
     * @param ctx the parse tree
     */
    exitLogfileGroupOptions?: (ctx: LogfileGroupOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.logfileGroupOption`.
     * @param ctx the parse tree
     */
    enterLogfileGroupOption?: (ctx: LogfileGroupOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.logfileGroupOption`.
     * @param ctx the parse tree
     */
    exitLogfileGroupOption?: (ctx: LogfileGroupOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createServer`.
     * @param ctx the parse tree
     */
    enterCreateServer?: (ctx: CreateServerContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createServer`.
     * @param ctx the parse tree
     */
    exitCreateServer?: (ctx: CreateServerContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.serverOptions`.
     * @param ctx the parse tree
     */
    enterServerOptions?: (ctx: ServerOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.serverOptions`.
     * @param ctx the parse tree
     */
    exitServerOptions?: (ctx: ServerOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.serverOption`.
     * @param ctx the parse tree
     */
    enterServerOption?: (ctx: ServerOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.serverOption`.
     * @param ctx the parse tree
     */
    exitServerOption?: (ctx: ServerOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createTablespace`.
     * @param ctx the parse tree
     */
    enterCreateTablespace?: (ctx: CreateTablespaceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createTablespace`.
     * @param ctx the parse tree
     */
    exitCreateTablespace?: (ctx: CreateTablespaceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createUndoTablespace`.
     * @param ctx the parse tree
     */
    enterCreateUndoTablespace?: (ctx: CreateUndoTablespaceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createUndoTablespace`.
     * @param ctx the parse tree
     */
    exitCreateUndoTablespace?: (ctx: CreateUndoTablespaceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsDataFileName`.
     * @param ctx the parse tree
     */
    enterTsDataFileName?: (ctx: TsDataFileNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsDataFileName`.
     * @param ctx the parse tree
     */
    exitTsDataFileName?: (ctx: TsDataFileNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsDataFile`.
     * @param ctx the parse tree
     */
    enterTsDataFile?: (ctx: TsDataFileContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsDataFile`.
     * @param ctx the parse tree
     */
    exitTsDataFile?: (ctx: TsDataFileContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tablespaceOptions`.
     * @param ctx the parse tree
     */
    enterTablespaceOptions?: (ctx: TablespaceOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tablespaceOptions`.
     * @param ctx the parse tree
     */
    exitTablespaceOptions?: (ctx: TablespaceOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tablespaceOption`.
     * @param ctx the parse tree
     */
    enterTablespaceOption?: (ctx: TablespaceOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tablespaceOption`.
     * @param ctx the parse tree
     */
    exitTablespaceOption?: (ctx: TablespaceOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsOptionInitialSize`.
     * @param ctx the parse tree
     */
    enterTsOptionInitialSize?: (ctx: TsOptionInitialSizeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsOptionInitialSize`.
     * @param ctx the parse tree
     */
    exitTsOptionInitialSize?: (ctx: TsOptionInitialSizeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsOptionUndoRedoBufferSize`.
     * @param ctx the parse tree
     */
    enterTsOptionUndoRedoBufferSize?: (ctx: TsOptionUndoRedoBufferSizeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsOptionUndoRedoBufferSize`.
     * @param ctx the parse tree
     */
    exitTsOptionUndoRedoBufferSize?: (ctx: TsOptionUndoRedoBufferSizeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsOptionAutoextendSize`.
     * @param ctx the parse tree
     */
    enterTsOptionAutoextendSize?: (ctx: TsOptionAutoextendSizeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsOptionAutoextendSize`.
     * @param ctx the parse tree
     */
    exitTsOptionAutoextendSize?: (ctx: TsOptionAutoextendSizeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsOptionMaxSize`.
     * @param ctx the parse tree
     */
    enterTsOptionMaxSize?: (ctx: TsOptionMaxSizeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsOptionMaxSize`.
     * @param ctx the parse tree
     */
    exitTsOptionMaxSize?: (ctx: TsOptionMaxSizeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsOptionExtentSize`.
     * @param ctx the parse tree
     */
    enterTsOptionExtentSize?: (ctx: TsOptionExtentSizeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsOptionExtentSize`.
     * @param ctx the parse tree
     */
    exitTsOptionExtentSize?: (ctx: TsOptionExtentSizeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsOptionNodegroup`.
     * @param ctx the parse tree
     */
    enterTsOptionNodegroup?: (ctx: TsOptionNodegroupContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsOptionNodegroup`.
     * @param ctx the parse tree
     */
    exitTsOptionNodegroup?: (ctx: TsOptionNodegroupContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsOptionEngine`.
     * @param ctx the parse tree
     */
    enterTsOptionEngine?: (ctx: TsOptionEngineContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsOptionEngine`.
     * @param ctx the parse tree
     */
    exitTsOptionEngine?: (ctx: TsOptionEngineContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsOptionWait`.
     * @param ctx the parse tree
     */
    enterTsOptionWait?: (ctx: TsOptionWaitContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsOptionWait`.
     * @param ctx the parse tree
     */
    exitTsOptionWait?: (ctx: TsOptionWaitContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsOptionComment`.
     * @param ctx the parse tree
     */
    enterTsOptionComment?: (ctx: TsOptionCommentContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsOptionComment`.
     * @param ctx the parse tree
     */
    exitTsOptionComment?: (ctx: TsOptionCommentContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsOptionFileblockSize`.
     * @param ctx the parse tree
     */
    enterTsOptionFileblockSize?: (ctx: TsOptionFileblockSizeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsOptionFileblockSize`.
     * @param ctx the parse tree
     */
    exitTsOptionFileblockSize?: (ctx: TsOptionFileblockSizeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsOptionEncryption`.
     * @param ctx the parse tree
     */
    enterTsOptionEncryption?: (ctx: TsOptionEncryptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsOptionEncryption`.
     * @param ctx the parse tree
     */
    exitTsOptionEncryption?: (ctx: TsOptionEncryptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tsOptionEngineAttribute`.
     * @param ctx the parse tree
     */
    enterTsOptionEngineAttribute?: (ctx: TsOptionEngineAttributeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tsOptionEngineAttribute`.
     * @param ctx the parse tree
     */
    exitTsOptionEngineAttribute?: (ctx: TsOptionEngineAttributeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createView`.
     * @param ctx the parse tree
     */
    enterCreateView?: (ctx: CreateViewContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createView`.
     * @param ctx the parse tree
     */
    exitCreateView?: (ctx: CreateViewContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.viewReplaceOrAlgorithm`.
     * @param ctx the parse tree
     */
    enterViewReplaceOrAlgorithm?: (ctx: ViewReplaceOrAlgorithmContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.viewReplaceOrAlgorithm`.
     * @param ctx the parse tree
     */
    exitViewReplaceOrAlgorithm?: (ctx: ViewReplaceOrAlgorithmContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.viewAlgorithm`.
     * @param ctx the parse tree
     */
    enterViewAlgorithm?: (ctx: ViewAlgorithmContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.viewAlgorithm`.
     * @param ctx the parse tree
     */
    exitViewAlgorithm?: (ctx: ViewAlgorithmContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.viewSuid`.
     * @param ctx the parse tree
     */
    enterViewSuid?: (ctx: ViewSuidContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.viewSuid`.
     * @param ctx the parse tree
     */
    exitViewSuid?: (ctx: ViewSuidContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createTrigger`.
     * @param ctx the parse tree
     */
    enterCreateTrigger?: (ctx: CreateTriggerContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createTrigger`.
     * @param ctx the parse tree
     */
    exitCreateTrigger?: (ctx: CreateTriggerContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.triggerFollowsPrecedesClause`.
     * @param ctx the parse tree
     */
    enterTriggerFollowsPrecedesClause?: (ctx: TriggerFollowsPrecedesClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.triggerFollowsPrecedesClause`.
     * @param ctx the parse tree
     */
    exitTriggerFollowsPrecedesClause?: (ctx: TriggerFollowsPrecedesClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createEvent`.
     * @param ctx the parse tree
     */
    enterCreateEvent?: (ctx: CreateEventContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createEvent`.
     * @param ctx the parse tree
     */
    exitCreateEvent?: (ctx: CreateEventContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createRole`.
     * @param ctx the parse tree
     */
    enterCreateRole?: (ctx: CreateRoleContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createRole`.
     * @param ctx the parse tree
     */
    exitCreateRole?: (ctx: CreateRoleContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createSpatialReference`.
     * @param ctx the parse tree
     */
    enterCreateSpatialReference?: (ctx: CreateSpatialReferenceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createSpatialReference`.
     * @param ctx the parse tree
     */
    exitCreateSpatialReference?: (ctx: CreateSpatialReferenceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.srsAttribute`.
     * @param ctx the parse tree
     */
    enterSrsAttribute?: (ctx: SrsAttributeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.srsAttribute`.
     * @param ctx the parse tree
     */
    exitSrsAttribute?: (ctx: SrsAttributeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropStatement`.
     * @param ctx the parse tree
     */
    enterDropStatement?: (ctx: DropStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropStatement`.
     * @param ctx the parse tree
     */
    exitDropStatement?: (ctx: DropStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropDatabase`.
     * @param ctx the parse tree
     */
    enterDropDatabase?: (ctx: DropDatabaseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropDatabase`.
     * @param ctx the parse tree
     */
    exitDropDatabase?: (ctx: DropDatabaseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropEvent`.
     * @param ctx the parse tree
     */
    enterDropEvent?: (ctx: DropEventContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropEvent`.
     * @param ctx the parse tree
     */
    exitDropEvent?: (ctx: DropEventContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropFunction`.
     * @param ctx the parse tree
     */
    enterDropFunction?: (ctx: DropFunctionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropFunction`.
     * @param ctx the parse tree
     */
    exitDropFunction?: (ctx: DropFunctionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropProcedure`.
     * @param ctx the parse tree
     */
    enterDropProcedure?: (ctx: DropProcedureContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropProcedure`.
     * @param ctx the parse tree
     */
    exitDropProcedure?: (ctx: DropProcedureContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropIndex`.
     * @param ctx the parse tree
     */
    enterDropIndex?: (ctx: DropIndexContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropIndex`.
     * @param ctx the parse tree
     */
    exitDropIndex?: (ctx: DropIndexContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropLogfileGroup`.
     * @param ctx the parse tree
     */
    enterDropLogfileGroup?: (ctx: DropLogfileGroupContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropLogfileGroup`.
     * @param ctx the parse tree
     */
    exitDropLogfileGroup?: (ctx: DropLogfileGroupContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropLogfileGroupOption`.
     * @param ctx the parse tree
     */
    enterDropLogfileGroupOption?: (ctx: DropLogfileGroupOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropLogfileGroupOption`.
     * @param ctx the parse tree
     */
    exitDropLogfileGroupOption?: (ctx: DropLogfileGroupOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropServer`.
     * @param ctx the parse tree
     */
    enterDropServer?: (ctx: DropServerContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropServer`.
     * @param ctx the parse tree
     */
    exitDropServer?: (ctx: DropServerContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropTable`.
     * @param ctx the parse tree
     */
    enterDropTable?: (ctx: DropTableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropTable`.
     * @param ctx the parse tree
     */
    exitDropTable?: (ctx: DropTableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropTableSpace`.
     * @param ctx the parse tree
     */
    enterDropTableSpace?: (ctx: DropTableSpaceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropTableSpace`.
     * @param ctx the parse tree
     */
    exitDropTableSpace?: (ctx: DropTableSpaceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropTrigger`.
     * @param ctx the parse tree
     */
    enterDropTrigger?: (ctx: DropTriggerContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropTrigger`.
     * @param ctx the parse tree
     */
    exitDropTrigger?: (ctx: DropTriggerContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropView`.
     * @param ctx the parse tree
     */
    enterDropView?: (ctx: DropViewContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropView`.
     * @param ctx the parse tree
     */
    exitDropView?: (ctx: DropViewContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropRole`.
     * @param ctx the parse tree
     */
    enterDropRole?: (ctx: DropRoleContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropRole`.
     * @param ctx the parse tree
     */
    exitDropRole?: (ctx: DropRoleContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropSpatialReference`.
     * @param ctx the parse tree
     */
    enterDropSpatialReference?: (ctx: DropSpatialReferenceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropSpatialReference`.
     * @param ctx the parse tree
     */
    exitDropSpatialReference?: (ctx: DropSpatialReferenceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropUndoTablespace`.
     * @param ctx the parse tree
     */
    enterDropUndoTablespace?: (ctx: DropUndoTablespaceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropUndoTablespace`.
     * @param ctx the parse tree
     */
    exitDropUndoTablespace?: (ctx: DropUndoTablespaceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.renameTableStatement`.
     * @param ctx the parse tree
     */
    enterRenameTableStatement?: (ctx: RenameTableStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.renameTableStatement`.
     * @param ctx the parse tree
     */
    exitRenameTableStatement?: (ctx: RenameTableStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.renamePair`.
     * @param ctx the parse tree
     */
    enterRenamePair?: (ctx: RenamePairContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.renamePair`.
     * @param ctx the parse tree
     */
    exitRenamePair?: (ctx: RenamePairContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.truncateTableStatement`.
     * @param ctx the parse tree
     */
    enterTruncateTableStatement?: (ctx: TruncateTableStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.truncateTableStatement`.
     * @param ctx the parse tree
     */
    exitTruncateTableStatement?: (ctx: TruncateTableStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.importStatement`.
     * @param ctx the parse tree
     */
    enterImportStatement?: (ctx: ImportStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.importStatement`.
     * @param ctx the parse tree
     */
    exitImportStatement?: (ctx: ImportStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.callStatement`.
     * @param ctx the parse tree
     */
    enterCallStatement?: (ctx: CallStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.callStatement`.
     * @param ctx the parse tree
     */
    exitCallStatement?: (ctx: CallStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.deleteStatement`.
     * @param ctx the parse tree
     */
    enterDeleteStatement?: (ctx: DeleteStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.deleteStatement`.
     * @param ctx the parse tree
     */
    exitDeleteStatement?: (ctx: DeleteStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.partitionDelete`.
     * @param ctx the parse tree
     */
    enterPartitionDelete?: (ctx: PartitionDeleteContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.partitionDelete`.
     * @param ctx the parse tree
     */
    exitPartitionDelete?: (ctx: PartitionDeleteContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.deleteStatementOption`.
     * @param ctx the parse tree
     */
    enterDeleteStatementOption?: (ctx: DeleteStatementOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.deleteStatementOption`.
     * @param ctx the parse tree
     */
    exitDeleteStatementOption?: (ctx: DeleteStatementOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.doStatement`.
     * @param ctx the parse tree
     */
    enterDoStatement?: (ctx: DoStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.doStatement`.
     * @param ctx the parse tree
     */
    exitDoStatement?: (ctx: DoStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.handlerStatement`.
     * @param ctx the parse tree
     */
    enterHandlerStatement?: (ctx: HandlerStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.handlerStatement`.
     * @param ctx the parse tree
     */
    exitHandlerStatement?: (ctx: HandlerStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.handlerReadOrScan`.
     * @param ctx the parse tree
     */
    enterHandlerReadOrScan?: (ctx: HandlerReadOrScanContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.handlerReadOrScan`.
     * @param ctx the parse tree
     */
    exitHandlerReadOrScan?: (ctx: HandlerReadOrScanContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.insertStatement`.
     * @param ctx the parse tree
     */
    enterInsertStatement?: (ctx: InsertStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.insertStatement`.
     * @param ctx the parse tree
     */
    exitInsertStatement?: (ctx: InsertStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.insertLockOption`.
     * @param ctx the parse tree
     */
    enterInsertLockOption?: (ctx: InsertLockOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.insertLockOption`.
     * @param ctx the parse tree
     */
    exitInsertLockOption?: (ctx: InsertLockOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.insertFromConstructor`.
     * @param ctx the parse tree
     */
    enterInsertFromConstructor?: (ctx: InsertFromConstructorContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.insertFromConstructor`.
     * @param ctx the parse tree
     */
    exitInsertFromConstructor?: (ctx: InsertFromConstructorContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.fields`.
     * @param ctx the parse tree
     */
    enterFields?: (ctx: FieldsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.fields`.
     * @param ctx the parse tree
     */
    exitFields?: (ctx: FieldsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.insertValues`.
     * @param ctx the parse tree
     */
    enterInsertValues?: (ctx: InsertValuesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.insertValues`.
     * @param ctx the parse tree
     */
    exitInsertValues?: (ctx: InsertValuesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.insertQueryExpression`.
     * @param ctx the parse tree
     */
    enterInsertQueryExpression?: (ctx: InsertQueryExpressionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.insertQueryExpression`.
     * @param ctx the parse tree
     */
    exitInsertQueryExpression?: (ctx: InsertQueryExpressionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.valueList`.
     * @param ctx the parse tree
     */
    enterValueList?: (ctx: ValueListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.valueList`.
     * @param ctx the parse tree
     */
    exitValueList?: (ctx: ValueListContext) => void;
    /**
     * Enter a parse tree produced by the `values`
     * labeled alternative in `MySQLParser.exprexprexprexprexprboolPriboolPriboolPriboolPripredicateOperationspredicateOperationspredicateOperationspredicateOperationssimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprpartitionTypeDefpartitionTypeDefpartitionTypeDef`.
     * @param ctx the parse tree
     */
    enterValues?: (ctx: ValuesContext) => void;
    /**
     * Exit a parse tree produced by the `values`
     * labeled alternative in `MySQLParser.exprexprexprexprexprboolPriboolPriboolPriboolPripredicateOperationspredicateOperationspredicateOperationspredicateOperationssimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprsimpleExprpartitionTypeDefpartitionTypeDefpartitionTypeDef`.
     * @param ctx the parse tree
     */
    exitValues?: (ctx: ValuesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.valuesReference`.
     * @param ctx the parse tree
     */
    enterValuesReference?: (ctx: ValuesReferenceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.valuesReference`.
     * @param ctx the parse tree
     */
    exitValuesReference?: (ctx: ValuesReferenceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.insertUpdateList`.
     * @param ctx the parse tree
     */
    enterInsertUpdateList?: (ctx: InsertUpdateListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.insertUpdateList`.
     * @param ctx the parse tree
     */
    exitInsertUpdateList?: (ctx: InsertUpdateListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.loadStatement`.
     * @param ctx the parse tree
     */
    enterLoadStatement?: (ctx: LoadStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.loadStatement`.
     * @param ctx the parse tree
     */
    exitLoadStatement?: (ctx: LoadStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dataOrXml`.
     * @param ctx the parse tree
     */
    enterDataOrXml?: (ctx: DataOrXmlContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dataOrXml`.
     * @param ctx the parse tree
     */
    exitDataOrXml?: (ctx: DataOrXmlContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.xmlRowsIdentifiedBy`.
     * @param ctx the parse tree
     */
    enterXmlRowsIdentifiedBy?: (ctx: XmlRowsIdentifiedByContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.xmlRowsIdentifiedBy`.
     * @param ctx the parse tree
     */
    exitXmlRowsIdentifiedBy?: (ctx: XmlRowsIdentifiedByContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.loadDataFileTail`.
     * @param ctx the parse tree
     */
    enterLoadDataFileTail?: (ctx: LoadDataFileTailContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.loadDataFileTail`.
     * @param ctx the parse tree
     */
    exitLoadDataFileTail?: (ctx: LoadDataFileTailContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.loadDataFileTargetList`.
     * @param ctx the parse tree
     */
    enterLoadDataFileTargetList?: (ctx: LoadDataFileTargetListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.loadDataFileTargetList`.
     * @param ctx the parse tree
     */
    exitLoadDataFileTargetList?: (ctx: LoadDataFileTargetListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.fieldOrVariableList`.
     * @param ctx the parse tree
     */
    enterFieldOrVariableList?: (ctx: FieldOrVariableListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.fieldOrVariableList`.
     * @param ctx the parse tree
     */
    exitFieldOrVariableList?: (ctx: FieldOrVariableListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.replaceStatement`.
     * @param ctx the parse tree
     */
    enterReplaceStatement?: (ctx: ReplaceStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.replaceStatement`.
     * @param ctx the parse tree
     */
    exitReplaceStatement?: (ctx: ReplaceStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.selectStatement`.
     * @param ctx the parse tree
     */
    enterSelectStatement?: (ctx: SelectStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.selectStatement`.
     * @param ctx the parse tree
     */
    exitSelectStatement?: (ctx: SelectStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.selectStatementWithInto`.
     * @param ctx the parse tree
     */
    enterSelectStatementWithInto?: (ctx: SelectStatementWithIntoContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.selectStatementWithInto`.
     * @param ctx the parse tree
     */
    exitSelectStatementWithInto?: (ctx: SelectStatementWithIntoContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.queryExpression`.
     * @param ctx the parse tree
     */
    enterQueryExpression?: (ctx: QueryExpressionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.queryExpression`.
     * @param ctx the parse tree
     */
    exitQueryExpression?: (ctx: QueryExpressionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.queryExpressionBody`.
     * @param ctx the parse tree
     */
    enterQueryExpressionBody?: (ctx: QueryExpressionBodyContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.queryExpressionBody`.
     * @param ctx the parse tree
     */
    exitQueryExpressionBody?: (ctx: QueryExpressionBodyContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.queryExpressionParens`.
     * @param ctx the parse tree
     */
    enterQueryExpressionParens?: (ctx: QueryExpressionParensContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.queryExpressionParens`.
     * @param ctx the parse tree
     */
    exitQueryExpressionParens?: (ctx: QueryExpressionParensContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.queryPrimary`.
     * @param ctx the parse tree
     */
    enterQueryPrimary?: (ctx: QueryPrimaryContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.queryPrimary`.
     * @param ctx the parse tree
     */
    exitQueryPrimary?: (ctx: QueryPrimaryContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.querySpecification`.
     * @param ctx the parse tree
     */
    enterQuerySpecification?: (ctx: QuerySpecificationContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.querySpecification`.
     * @param ctx the parse tree
     */
    exitQuerySpecification?: (ctx: QuerySpecificationContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.subquery`.
     * @param ctx the parse tree
     */
    enterSubquery?: (ctx: SubqueryContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.subquery`.
     * @param ctx the parse tree
     */
    exitSubquery?: (ctx: SubqueryContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.querySpecOption`.
     * @param ctx the parse tree
     */
    enterQuerySpecOption?: (ctx: QuerySpecOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.querySpecOption`.
     * @param ctx the parse tree
     */
    exitQuerySpecOption?: (ctx: QuerySpecOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.limitClause`.
     * @param ctx the parse tree
     */
    enterLimitClause?: (ctx: LimitClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.limitClause`.
     * @param ctx the parse tree
     */
    exitLimitClause?: (ctx: LimitClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.simpleLimitClause`.
     * @param ctx the parse tree
     */
    enterSimpleLimitClause?: (ctx: SimpleLimitClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.simpleLimitClause`.
     * @param ctx the parse tree
     */
    exitSimpleLimitClause?: (ctx: SimpleLimitClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.limitOptions`.
     * @param ctx the parse tree
     */
    enterLimitOptions?: (ctx: LimitOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.limitOptions`.
     * @param ctx the parse tree
     */
    exitLimitOptions?: (ctx: LimitOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.limitOption`.
     * @param ctx the parse tree
     */
    enterLimitOption?: (ctx: LimitOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.limitOption`.
     * @param ctx the parse tree
     */
    exitLimitOption?: (ctx: LimitOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.intoClause`.
     * @param ctx the parse tree
     */
    enterIntoClause?: (ctx: IntoClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.intoClause`.
     * @param ctx the parse tree
     */
    exitIntoClause?: (ctx: IntoClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.procedureAnalyseClause`.
     * @param ctx the parse tree
     */
    enterProcedureAnalyseClause?: (ctx: ProcedureAnalyseClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.procedureAnalyseClause`.
     * @param ctx the parse tree
     */
    exitProcedureAnalyseClause?: (ctx: ProcedureAnalyseClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.havingClause`.
     * @param ctx the parse tree
     */
    enterHavingClause?: (ctx: HavingClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.havingClause`.
     * @param ctx the parse tree
     */
    exitHavingClause?: (ctx: HavingClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowClause`.
     * @param ctx the parse tree
     */
    enterWindowClause?: (ctx: WindowClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowClause`.
     * @param ctx the parse tree
     */
    exitWindowClause?: (ctx: WindowClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowDefinition`.
     * @param ctx the parse tree
     */
    enterWindowDefinition?: (ctx: WindowDefinitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowDefinition`.
     * @param ctx the parse tree
     */
    exitWindowDefinition?: (ctx: WindowDefinitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowSpec`.
     * @param ctx the parse tree
     */
    enterWindowSpec?: (ctx: WindowSpecContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowSpec`.
     * @param ctx the parse tree
     */
    exitWindowSpec?: (ctx: WindowSpecContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowSpecDetails`.
     * @param ctx the parse tree
     */
    enterWindowSpecDetails?: (ctx: WindowSpecDetailsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowSpecDetails`.
     * @param ctx the parse tree
     */
    exitWindowSpecDetails?: (ctx: WindowSpecDetailsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowFrameClause`.
     * @param ctx the parse tree
     */
    enterWindowFrameClause?: (ctx: WindowFrameClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowFrameClause`.
     * @param ctx the parse tree
     */
    exitWindowFrameClause?: (ctx: WindowFrameClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowFrameUnits`.
     * @param ctx the parse tree
     */
    enterWindowFrameUnits?: (ctx: WindowFrameUnitsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowFrameUnits`.
     * @param ctx the parse tree
     */
    exitWindowFrameUnits?: (ctx: WindowFrameUnitsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowFrameExtent`.
     * @param ctx the parse tree
     */
    enterWindowFrameExtent?: (ctx: WindowFrameExtentContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowFrameExtent`.
     * @param ctx the parse tree
     */
    exitWindowFrameExtent?: (ctx: WindowFrameExtentContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowFrameStart`.
     * @param ctx the parse tree
     */
    enterWindowFrameStart?: (ctx: WindowFrameStartContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowFrameStart`.
     * @param ctx the parse tree
     */
    exitWindowFrameStart?: (ctx: WindowFrameStartContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowFrameBetween`.
     * @param ctx the parse tree
     */
    enterWindowFrameBetween?: (ctx: WindowFrameBetweenContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowFrameBetween`.
     * @param ctx the parse tree
     */
    exitWindowFrameBetween?: (ctx: WindowFrameBetweenContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowFrameBound`.
     * @param ctx the parse tree
     */
    enterWindowFrameBound?: (ctx: WindowFrameBoundContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowFrameBound`.
     * @param ctx the parse tree
     */
    exitWindowFrameBound?: (ctx: WindowFrameBoundContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowFrameExclusion`.
     * @param ctx the parse tree
     */
    enterWindowFrameExclusion?: (ctx: WindowFrameExclusionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowFrameExclusion`.
     * @param ctx the parse tree
     */
    exitWindowFrameExclusion?: (ctx: WindowFrameExclusionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.withClause`.
     * @param ctx the parse tree
     */
    enterWithClause?: (ctx: WithClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.withClause`.
     * @param ctx the parse tree
     */
    exitWithClause?: (ctx: WithClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.commonTableExpression`.
     * @param ctx the parse tree
     */
    enterCommonTableExpression?: (ctx: CommonTableExpressionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.commonTableExpression`.
     * @param ctx the parse tree
     */
    exitCommonTableExpression?: (ctx: CommonTableExpressionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.groupByClause`.
     * @param ctx the parse tree
     */
    enterGroupByClause?: (ctx: GroupByClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.groupByClause`.
     * @param ctx the parse tree
     */
    exitGroupByClause?: (ctx: GroupByClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.olapOption`.
     * @param ctx the parse tree
     */
    enterOlapOption?: (ctx: OlapOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.olapOption`.
     * @param ctx the parse tree
     */
    exitOlapOption?: (ctx: OlapOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.orderClause`.
     * @param ctx the parse tree
     */
    enterOrderClause?: (ctx: OrderClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.orderClause`.
     * @param ctx the parse tree
     */
    exitOrderClause?: (ctx: OrderClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.direction`.
     * @param ctx the parse tree
     */
    enterDirection?: (ctx: DirectionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.direction`.
     * @param ctx the parse tree
     */
    exitDirection?: (ctx: DirectionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.fromClause`.
     * @param ctx the parse tree
     */
    enterFromClause?: (ctx: FromClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.fromClause`.
     * @param ctx the parse tree
     */
    exitFromClause?: (ctx: FromClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableReferenceList`.
     * @param ctx the parse tree
     */
    enterTableReferenceList?: (ctx: TableReferenceListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableReferenceList`.
     * @param ctx the parse tree
     */
    exitTableReferenceList?: (ctx: TableReferenceListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableValueConstructor`.
     * @param ctx the parse tree
     */
    enterTableValueConstructor?: (ctx: TableValueConstructorContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableValueConstructor`.
     * @param ctx the parse tree
     */
    exitTableValueConstructor?: (ctx: TableValueConstructorContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.explicitTable`.
     * @param ctx the parse tree
     */
    enterExplicitTable?: (ctx: ExplicitTableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.explicitTable`.
     * @param ctx the parse tree
     */
    exitExplicitTable?: (ctx: ExplicitTableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.rowValueExplicit`.
     * @param ctx the parse tree
     */
    enterRowValueExplicit?: (ctx: RowValueExplicitContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.rowValueExplicit`.
     * @param ctx the parse tree
     */
    exitRowValueExplicit?: (ctx: RowValueExplicitContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.selectOption`.
     * @param ctx the parse tree
     */
    enterSelectOption?: (ctx: SelectOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.selectOption`.
     * @param ctx the parse tree
     */
    exitSelectOption?: (ctx: SelectOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.lockingClauseList`.
     * @param ctx the parse tree
     */
    enterLockingClauseList?: (ctx: LockingClauseListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.lockingClauseList`.
     * @param ctx the parse tree
     */
    exitLockingClauseList?: (ctx: LockingClauseListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.lockingClause`.
     * @param ctx the parse tree
     */
    enterLockingClause?: (ctx: LockingClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.lockingClause`.
     * @param ctx the parse tree
     */
    exitLockingClause?: (ctx: LockingClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.lockStrengh`.
     * @param ctx the parse tree
     */
    enterLockStrengh?: (ctx: LockStrenghContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.lockStrengh`.
     * @param ctx the parse tree
     */
    exitLockStrengh?: (ctx: LockStrenghContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.lockedRowAction`.
     * @param ctx the parse tree
     */
    enterLockedRowAction?: (ctx: LockedRowActionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.lockedRowAction`.
     * @param ctx the parse tree
     */
    exitLockedRowAction?: (ctx: LockedRowActionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.selectItemList`.
     * @param ctx the parse tree
     */
    enterSelectItemList?: (ctx: SelectItemListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.selectItemList`.
     * @param ctx the parse tree
     */
    exitSelectItemList?: (ctx: SelectItemListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.selectItem`.
     * @param ctx the parse tree
     */
    enterSelectItem?: (ctx: SelectItemContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.selectItem`.
     * @param ctx the parse tree
     */
    exitSelectItem?: (ctx: SelectItemContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.selectAlias`.
     * @param ctx the parse tree
     */
    enterSelectAlias?: (ctx: SelectAliasContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.selectAlias`.
     * @param ctx the parse tree
     */
    exitSelectAlias?: (ctx: SelectAliasContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.whereClause`.
     * @param ctx the parse tree
     */
    enterWhereClause?: (ctx: WhereClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.whereClause`.
     * @param ctx the parse tree
     */
    exitWhereClause?: (ctx: WhereClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableReference`.
     * @param ctx the parse tree
     */
    enterTableReference?: (ctx: TableReferenceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableReference`.
     * @param ctx the parse tree
     */
    exitTableReference?: (ctx: TableReferenceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.escapedTableReference`.
     * @param ctx the parse tree
     */
    enterEscapedTableReference?: (ctx: EscapedTableReferenceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.escapedTableReference`.
     * @param ctx the parse tree
     */
    exitEscapedTableReference?: (ctx: EscapedTableReferenceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.joinedTable`.
     * @param ctx the parse tree
     */
    enterJoinedTable?: (ctx: JoinedTableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.joinedTable`.
     * @param ctx the parse tree
     */
    exitJoinedTable?: (ctx: JoinedTableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.naturalJoinType`.
     * @param ctx the parse tree
     */
    enterNaturalJoinType?: (ctx: NaturalJoinTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.naturalJoinType`.
     * @param ctx the parse tree
     */
    exitNaturalJoinType?: (ctx: NaturalJoinTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.innerJoinType`.
     * @param ctx the parse tree
     */
    enterInnerJoinType?: (ctx: InnerJoinTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.innerJoinType`.
     * @param ctx the parse tree
     */
    exitInnerJoinType?: (ctx: InnerJoinTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.outerJoinType`.
     * @param ctx the parse tree
     */
    enterOuterJoinType?: (ctx: OuterJoinTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.outerJoinType`.
     * @param ctx the parse tree
     */
    exitOuterJoinType?: (ctx: OuterJoinTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableFactor`.
     * @param ctx the parse tree
     */
    enterTableFactor?: (ctx: TableFactorContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableFactor`.
     * @param ctx the parse tree
     */
    exitTableFactor?: (ctx: TableFactorContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.singleTable`.
     * @param ctx the parse tree
     */
    enterSingleTable?: (ctx: SingleTableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.singleTable`.
     * @param ctx the parse tree
     */
    exitSingleTable?: (ctx: SingleTableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.singleTableParens`.
     * @param ctx the parse tree
     */
    enterSingleTableParens?: (ctx: SingleTableParensContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.singleTableParens`.
     * @param ctx the parse tree
     */
    exitSingleTableParens?: (ctx: SingleTableParensContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.derivedTable`.
     * @param ctx the parse tree
     */
    enterDerivedTable?: (ctx: DerivedTableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.derivedTable`.
     * @param ctx the parse tree
     */
    exitDerivedTable?: (ctx: DerivedTableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableReferenceListParens`.
     * @param ctx the parse tree
     */
    enterTableReferenceListParens?: (ctx: TableReferenceListParensContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableReferenceListParens`.
     * @param ctx the parse tree
     */
    exitTableReferenceListParens?: (ctx: TableReferenceListParensContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableFunction`.
     * @param ctx the parse tree
     */
    enterTableFunction?: (ctx: TableFunctionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableFunction`.
     * @param ctx the parse tree
     */
    exitTableFunction?: (ctx: TableFunctionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.columnsClause`.
     * @param ctx the parse tree
     */
    enterColumnsClause?: (ctx: ColumnsClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.columnsClause`.
     * @param ctx the parse tree
     */
    exitColumnsClause?: (ctx: ColumnsClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.jtColumn`.
     * @param ctx the parse tree
     */
    enterJtColumn?: (ctx: JtColumnContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.jtColumn`.
     * @param ctx the parse tree
     */
    exitJtColumn?: (ctx: JtColumnContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.onEmptyOrError`.
     * @param ctx the parse tree
     */
    enterOnEmptyOrError?: (ctx: OnEmptyOrErrorContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.onEmptyOrError`.
     * @param ctx the parse tree
     */
    exitOnEmptyOrError?: (ctx: OnEmptyOrErrorContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.onEmptyOrErrorJsonTable`.
     * @param ctx the parse tree
     */
    enterOnEmptyOrErrorJsonTable?: (ctx: OnEmptyOrErrorJsonTableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.onEmptyOrErrorJsonTable`.
     * @param ctx the parse tree
     */
    exitOnEmptyOrErrorJsonTable?: (ctx: OnEmptyOrErrorJsonTableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.onEmpty`.
     * @param ctx the parse tree
     */
    enterOnEmpty?: (ctx: OnEmptyContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.onEmpty`.
     * @param ctx the parse tree
     */
    exitOnEmpty?: (ctx: OnEmptyContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.onError`.
     * @param ctx the parse tree
     */
    enterOnError?: (ctx: OnErrorContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.onError`.
     * @param ctx the parse tree
     */
    exitOnError?: (ctx: OnErrorContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.jsonOnResponse`.
     * @param ctx the parse tree
     */
    enterJsonOnResponse?: (ctx: JsonOnResponseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.jsonOnResponse`.
     * @param ctx the parse tree
     */
    exitJsonOnResponse?: (ctx: JsonOnResponseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.unionOption`.
     * @param ctx the parse tree
     */
    enterUnionOption?: (ctx: UnionOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.unionOption`.
     * @param ctx the parse tree
     */
    exitUnionOption?: (ctx: UnionOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableAlias`.
     * @param ctx the parse tree
     */
    enterTableAlias?: (ctx: TableAliasContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableAlias`.
     * @param ctx the parse tree
     */
    exitTableAlias?: (ctx: TableAliasContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.indexHintList`.
     * @param ctx the parse tree
     */
    enterIndexHintList?: (ctx: IndexHintListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.indexHintList`.
     * @param ctx the parse tree
     */
    exitIndexHintList?: (ctx: IndexHintListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.indexHint`.
     * @param ctx the parse tree
     */
    enterIndexHint?: (ctx: IndexHintContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.indexHint`.
     * @param ctx the parse tree
     */
    exitIndexHint?: (ctx: IndexHintContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.indexHintType`.
     * @param ctx the parse tree
     */
    enterIndexHintType?: (ctx: IndexHintTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.indexHintType`.
     * @param ctx the parse tree
     */
    exitIndexHintType?: (ctx: IndexHintTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.keyOrIndex`.
     * @param ctx the parse tree
     */
    enterKeyOrIndex?: (ctx: KeyOrIndexContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.keyOrIndex`.
     * @param ctx the parse tree
     */
    exitKeyOrIndex?: (ctx: KeyOrIndexContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.constraintKeyType`.
     * @param ctx the parse tree
     */
    enterConstraintKeyType?: (ctx: ConstraintKeyTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.constraintKeyType`.
     * @param ctx the parse tree
     */
    exitConstraintKeyType?: (ctx: ConstraintKeyTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.indexHintClause`.
     * @param ctx the parse tree
     */
    enterIndexHintClause?: (ctx: IndexHintClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.indexHintClause`.
     * @param ctx the parse tree
     */
    exitIndexHintClause?: (ctx: IndexHintClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.indexList`.
     * @param ctx the parse tree
     */
    enterIndexList?: (ctx: IndexListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.indexList`.
     * @param ctx the parse tree
     */
    exitIndexList?: (ctx: IndexListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.indexListElement`.
     * @param ctx the parse tree
     */
    enterIndexListElement?: (ctx: IndexListElementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.indexListElement`.
     * @param ctx the parse tree
     */
    exitIndexListElement?: (ctx: IndexListElementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.updateStatement`.
     * @param ctx the parse tree
     */
    enterUpdateStatement?: (ctx: UpdateStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.updateStatement`.
     * @param ctx the parse tree
     */
    exitUpdateStatement?: (ctx: UpdateStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.transactionOrLockingStatement`.
     * @param ctx the parse tree
     */
    enterTransactionOrLockingStatement?: (ctx: TransactionOrLockingStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.transactionOrLockingStatement`.
     * @param ctx the parse tree
     */
    exitTransactionOrLockingStatement?: (ctx: TransactionOrLockingStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.transactionStatement`.
     * @param ctx the parse tree
     */
    enterTransactionStatement?: (ctx: TransactionStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.transactionStatement`.
     * @param ctx the parse tree
     */
    exitTransactionStatement?: (ctx: TransactionStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.beginWork`.
     * @param ctx the parse tree
     */
    enterBeginWork?: (ctx: BeginWorkContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.beginWork`.
     * @param ctx the parse tree
     */
    exitBeginWork?: (ctx: BeginWorkContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.startTransactionOptionList`.
     * @param ctx the parse tree
     */
    enterStartTransactionOptionList?: (ctx: StartTransactionOptionListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.startTransactionOptionList`.
     * @param ctx the parse tree
     */
    exitStartTransactionOptionList?: (ctx: StartTransactionOptionListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.savepointStatement`.
     * @param ctx the parse tree
     */
    enterSavepointStatement?: (ctx: SavepointStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.savepointStatement`.
     * @param ctx the parse tree
     */
    exitSavepointStatement?: (ctx: SavepointStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.lockStatement`.
     * @param ctx the parse tree
     */
    enterLockStatement?: (ctx: LockStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.lockStatement`.
     * @param ctx the parse tree
     */
    exitLockStatement?: (ctx: LockStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.lockItem`.
     * @param ctx the parse tree
     */
    enterLockItem?: (ctx: LockItemContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.lockItem`.
     * @param ctx the parse tree
     */
    exitLockItem?: (ctx: LockItemContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.lockOption`.
     * @param ctx the parse tree
     */
    enterLockOption?: (ctx: LockOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.lockOption`.
     * @param ctx the parse tree
     */
    exitLockOption?: (ctx: LockOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.xaStatement`.
     * @param ctx the parse tree
     */
    enterXaStatement?: (ctx: XaStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.xaStatement`.
     * @param ctx the parse tree
     */
    exitXaStatement?: (ctx: XaStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.xaConvert`.
     * @param ctx the parse tree
     */
    enterXaConvert?: (ctx: XaConvertContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.xaConvert`.
     * @param ctx the parse tree
     */
    exitXaConvert?: (ctx: XaConvertContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.xid`.
     * @param ctx the parse tree
     */
    enterXid?: (ctx: XidContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.xid`.
     * @param ctx the parse tree
     */
    exitXid?: (ctx: XidContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.replicationStatement`.
     * @param ctx the parse tree
     */
    enterReplicationStatement?: (ctx: ReplicationStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.replicationStatement`.
     * @param ctx the parse tree
     */
    exitReplicationStatement?: (ctx: ReplicationStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.resetOption`.
     * @param ctx the parse tree
     */
    enterResetOption?: (ctx: ResetOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.resetOption`.
     * @param ctx the parse tree
     */
    exitResetOption?: (ctx: ResetOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.sourceResetOptions`.
     * @param ctx the parse tree
     */
    enterSourceResetOptions?: (ctx: SourceResetOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.sourceResetOptions`.
     * @param ctx the parse tree
     */
    exitSourceResetOptions?: (ctx: SourceResetOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.replicationLoad`.
     * @param ctx the parse tree
     */
    enterReplicationLoad?: (ctx: ReplicationLoadContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.replicationLoad`.
     * @param ctx the parse tree
     */
    exitReplicationLoad?: (ctx: ReplicationLoadContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSource`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSource?: (ctx: ChangeReplicationSourceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSource`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSource?: (ctx: ChangeReplicationSourceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeSource`.
     * @param ctx the parse tree
     */
    enterChangeSource?: (ctx: ChangeSourceContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeSource`.
     * @param ctx the parse tree
     */
    exitChangeSource?: (ctx: ChangeSourceContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.sourceDefinitions`.
     * @param ctx the parse tree
     */
    enterSourceDefinitions?: (ctx: SourceDefinitionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.sourceDefinitions`.
     * @param ctx the parse tree
     */
    exitSourceDefinitions?: (ctx: SourceDefinitionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.sourceDefinition`.
     * @param ctx the parse tree
     */
    enterSourceDefinition?: (ctx: SourceDefinitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.sourceDefinition`.
     * @param ctx the parse tree
     */
    exitSourceDefinition?: (ctx: SourceDefinitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceAutoPosition`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceAutoPosition?: (ctx: ChangeReplicationSourceAutoPositionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceAutoPosition`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceAutoPosition?: (ctx: ChangeReplicationSourceAutoPositionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceHost`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceHost?: (ctx: ChangeReplicationSourceHostContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceHost`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceHost?: (ctx: ChangeReplicationSourceHostContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceBind`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceBind?: (ctx: ChangeReplicationSourceBindContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceBind`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceBind?: (ctx: ChangeReplicationSourceBindContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceUser`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceUser?: (ctx: ChangeReplicationSourceUserContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceUser`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceUser?: (ctx: ChangeReplicationSourceUserContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourcePassword`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourcePassword?: (ctx: ChangeReplicationSourcePasswordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourcePassword`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourcePassword?: (ctx: ChangeReplicationSourcePasswordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourcePort`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourcePort?: (ctx: ChangeReplicationSourcePortContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourcePort`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourcePort?: (ctx: ChangeReplicationSourcePortContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceConnectRetry`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceConnectRetry?: (ctx: ChangeReplicationSourceConnectRetryContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceConnectRetry`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceConnectRetry?: (ctx: ChangeReplicationSourceConnectRetryContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceRetryCount`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceRetryCount?: (ctx: ChangeReplicationSourceRetryCountContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceRetryCount`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceRetryCount?: (ctx: ChangeReplicationSourceRetryCountContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceDelay`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceDelay?: (ctx: ChangeReplicationSourceDelayContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceDelay`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceDelay?: (ctx: ChangeReplicationSourceDelayContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceSSL`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceSSL?: (ctx: ChangeReplicationSourceSSLContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceSSL`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceSSL?: (ctx: ChangeReplicationSourceSSLContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceSSLCA`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceSSLCA?: (ctx: ChangeReplicationSourceSSLCAContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceSSLCA`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceSSLCA?: (ctx: ChangeReplicationSourceSSLCAContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceSSLCApath`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceSSLCApath?: (ctx: ChangeReplicationSourceSSLCApathContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceSSLCApath`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceSSLCApath?: (ctx: ChangeReplicationSourceSSLCApathContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceSSLCipher`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceSSLCipher?: (ctx: ChangeReplicationSourceSSLCipherContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceSSLCipher`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceSSLCipher?: (ctx: ChangeReplicationSourceSSLCipherContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceSSLCLR`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceSSLCLR?: (ctx: ChangeReplicationSourceSSLCLRContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceSSLCLR`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceSSLCLR?: (ctx: ChangeReplicationSourceSSLCLRContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceSSLCLRpath`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceSSLCLRpath?: (ctx: ChangeReplicationSourceSSLCLRpathContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceSSLCLRpath`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceSSLCLRpath?: (ctx: ChangeReplicationSourceSSLCLRpathContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceSSLKey`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceSSLKey?: (ctx: ChangeReplicationSourceSSLKeyContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceSSLKey`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceSSLKey?: (ctx: ChangeReplicationSourceSSLKeyContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceSSLVerifyServerCert`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceSSLVerifyServerCert?: (ctx: ChangeReplicationSourceSSLVerifyServerCertContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceSSLVerifyServerCert`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceSSLVerifyServerCert?: (ctx: ChangeReplicationSourceSSLVerifyServerCertContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceTLSVersion`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceTLSVersion?: (ctx: ChangeReplicationSourceTLSVersionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceTLSVersion`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceTLSVersion?: (ctx: ChangeReplicationSourceTLSVersionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceTLSCiphersuites`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceTLSCiphersuites?: (ctx: ChangeReplicationSourceTLSCiphersuitesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceTLSCiphersuites`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceTLSCiphersuites?: (ctx: ChangeReplicationSourceTLSCiphersuitesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceSSLCert`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceSSLCert?: (ctx: ChangeReplicationSourceSSLCertContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceSSLCert`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceSSLCert?: (ctx: ChangeReplicationSourceSSLCertContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourcePublicKey`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourcePublicKey?: (ctx: ChangeReplicationSourcePublicKeyContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourcePublicKey`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourcePublicKey?: (ctx: ChangeReplicationSourcePublicKeyContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceGetSourcePublicKey`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceGetSourcePublicKey?: (ctx: ChangeReplicationSourceGetSourcePublicKeyContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceGetSourcePublicKey`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceGetSourcePublicKey?: (ctx: ChangeReplicationSourceGetSourcePublicKeyContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceHeartbeatPeriod`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceHeartbeatPeriod?: (ctx: ChangeReplicationSourceHeartbeatPeriodContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceHeartbeatPeriod`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceHeartbeatPeriod?: (ctx: ChangeReplicationSourceHeartbeatPeriodContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceCompressionAlgorithm`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceCompressionAlgorithm?: (ctx: ChangeReplicationSourceCompressionAlgorithmContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceCompressionAlgorithm`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceCompressionAlgorithm?: (ctx: ChangeReplicationSourceCompressionAlgorithmContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplicationSourceZstdCompressionLevel`.
     * @param ctx the parse tree
     */
    enterChangeReplicationSourceZstdCompressionLevel?: (ctx: ChangeReplicationSourceZstdCompressionLevelContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplicationSourceZstdCompressionLevel`.
     * @param ctx the parse tree
     */
    exitChangeReplicationSourceZstdCompressionLevel?: (ctx: ChangeReplicationSourceZstdCompressionLevelContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.privilegeCheckDef`.
     * @param ctx the parse tree
     */
    enterPrivilegeCheckDef?: (ctx: PrivilegeCheckDefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.privilegeCheckDef`.
     * @param ctx the parse tree
     */
    exitPrivilegeCheckDef?: (ctx: PrivilegeCheckDefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tablePrimaryKeyCheckDef`.
     * @param ctx the parse tree
     */
    enterTablePrimaryKeyCheckDef?: (ctx: TablePrimaryKeyCheckDefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tablePrimaryKeyCheckDef`.
     * @param ctx the parse tree
     */
    exitTablePrimaryKeyCheckDef?: (ctx: TablePrimaryKeyCheckDefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.assignGtidsToAnonymousTransactionsDefinition`.
     * @param ctx the parse tree
     */
    enterAssignGtidsToAnonymousTransactionsDefinition?: (ctx: AssignGtidsToAnonymousTransactionsDefinitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.assignGtidsToAnonymousTransactionsDefinition`.
     * @param ctx the parse tree
     */
    exitAssignGtidsToAnonymousTransactionsDefinition?: (ctx: AssignGtidsToAnonymousTransactionsDefinitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.sourceTlsCiphersuitesDef`.
     * @param ctx the parse tree
     */
    enterSourceTlsCiphersuitesDef?: (ctx: SourceTlsCiphersuitesDefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.sourceTlsCiphersuitesDef`.
     * @param ctx the parse tree
     */
    exitSourceTlsCiphersuitesDef?: (ctx: SourceTlsCiphersuitesDefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.sourceFileDef`.
     * @param ctx the parse tree
     */
    enterSourceFileDef?: (ctx: SourceFileDefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.sourceFileDef`.
     * @param ctx the parse tree
     */
    exitSourceFileDef?: (ctx: SourceFileDefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.sourceLogFile`.
     * @param ctx the parse tree
     */
    enterSourceLogFile?: (ctx: SourceLogFileContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.sourceLogFile`.
     * @param ctx the parse tree
     */
    exitSourceLogFile?: (ctx: SourceLogFileContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.sourceLogPos`.
     * @param ctx the parse tree
     */
    enterSourceLogPos?: (ctx: SourceLogPosContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.sourceLogPos`.
     * @param ctx the parse tree
     */
    exitSourceLogPos?: (ctx: SourceLogPosContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.serverIdList`.
     * @param ctx the parse tree
     */
    enterServerIdList?: (ctx: ServerIdListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.serverIdList`.
     * @param ctx the parse tree
     */
    exitServerIdList?: (ctx: ServerIdListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.changeReplication`.
     * @param ctx the parse tree
     */
    enterChangeReplication?: (ctx: ChangeReplicationContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.changeReplication`.
     * @param ctx the parse tree
     */
    exitChangeReplication?: (ctx: ChangeReplicationContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.filterDefinition`.
     * @param ctx the parse tree
     */
    enterFilterDefinition?: (ctx: FilterDefinitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.filterDefinition`.
     * @param ctx the parse tree
     */
    exitFilterDefinition?: (ctx: FilterDefinitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.filterDbList`.
     * @param ctx the parse tree
     */
    enterFilterDbList?: (ctx: FilterDbListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.filterDbList`.
     * @param ctx the parse tree
     */
    exitFilterDbList?: (ctx: FilterDbListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.filterTableList`.
     * @param ctx the parse tree
     */
    enterFilterTableList?: (ctx: FilterTableListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.filterTableList`.
     * @param ctx the parse tree
     */
    exitFilterTableList?: (ctx: FilterTableListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.filterStringList`.
     * @param ctx the parse tree
     */
    enterFilterStringList?: (ctx: FilterStringListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.filterStringList`.
     * @param ctx the parse tree
     */
    exitFilterStringList?: (ctx: FilterStringListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.filterWildDbTableString`.
     * @param ctx the parse tree
     */
    enterFilterWildDbTableString?: (ctx: FilterWildDbTableStringContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.filterWildDbTableString`.
     * @param ctx the parse tree
     */
    exitFilterWildDbTableString?: (ctx: FilterWildDbTableStringContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.filterDbPairList`.
     * @param ctx the parse tree
     */
    enterFilterDbPairList?: (ctx: FilterDbPairListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.filterDbPairList`.
     * @param ctx the parse tree
     */
    exitFilterDbPairList?: (ctx: FilterDbPairListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.startReplicaStatement`.
     * @param ctx the parse tree
     */
    enterStartReplicaStatement?: (ctx: StartReplicaStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.startReplicaStatement`.
     * @param ctx the parse tree
     */
    exitStartReplicaStatement?: (ctx: StartReplicaStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.stopReplicaStatement`.
     * @param ctx the parse tree
     */
    enterStopReplicaStatement?: (ctx: StopReplicaStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.stopReplicaStatement`.
     * @param ctx the parse tree
     */
    exitStopReplicaStatement?: (ctx: StopReplicaStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.replicaUntil`.
     * @param ctx the parse tree
     */
    enterReplicaUntil?: (ctx: ReplicaUntilContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.replicaUntil`.
     * @param ctx the parse tree
     */
    exitReplicaUntil?: (ctx: ReplicaUntilContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.userOption`.
     * @param ctx the parse tree
     */
    enterUserOption?: (ctx: UserOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.userOption`.
     * @param ctx the parse tree
     */
    exitUserOption?: (ctx: UserOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.passwordOption`.
     * @param ctx the parse tree
     */
    enterPasswordOption?: (ctx: PasswordOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.passwordOption`.
     * @param ctx the parse tree
     */
    exitPasswordOption?: (ctx: PasswordOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.defaultAuthOption`.
     * @param ctx the parse tree
     */
    enterDefaultAuthOption?: (ctx: DefaultAuthOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.defaultAuthOption`.
     * @param ctx the parse tree
     */
    exitDefaultAuthOption?: (ctx: DefaultAuthOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.pluginDirOption`.
     * @param ctx the parse tree
     */
    enterPluginDirOption?: (ctx: PluginDirOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.pluginDirOption`.
     * @param ctx the parse tree
     */
    exitPluginDirOption?: (ctx: PluginDirOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.replicaThreadOptions`.
     * @param ctx the parse tree
     */
    enterReplicaThreadOptions?: (ctx: ReplicaThreadOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.replicaThreadOptions`.
     * @param ctx the parse tree
     */
    exitReplicaThreadOptions?: (ctx: ReplicaThreadOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.replicaThreadOption`.
     * @param ctx the parse tree
     */
    enterReplicaThreadOption?: (ctx: ReplicaThreadOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.replicaThreadOption`.
     * @param ctx the parse tree
     */
    exitReplicaThreadOption?: (ctx: ReplicaThreadOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.groupReplication`.
     * @param ctx the parse tree
     */
    enterGroupReplication?: (ctx: GroupReplicationContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.groupReplication`.
     * @param ctx the parse tree
     */
    exitGroupReplication?: (ctx: GroupReplicationContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.groupReplicationStartOptions`.
     * @param ctx the parse tree
     */
    enterGroupReplicationStartOptions?: (ctx: GroupReplicationStartOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.groupReplicationStartOptions`.
     * @param ctx the parse tree
     */
    exitGroupReplicationStartOptions?: (ctx: GroupReplicationStartOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.groupReplicationStartOption`.
     * @param ctx the parse tree
     */
    enterGroupReplicationStartOption?: (ctx: GroupReplicationStartOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.groupReplicationStartOption`.
     * @param ctx the parse tree
     */
    exitGroupReplicationStartOption?: (ctx: GroupReplicationStartOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.groupReplicationUser`.
     * @param ctx the parse tree
     */
    enterGroupReplicationUser?: (ctx: GroupReplicationUserContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.groupReplicationUser`.
     * @param ctx the parse tree
     */
    exitGroupReplicationUser?: (ctx: GroupReplicationUserContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.groupReplicationPassword`.
     * @param ctx the parse tree
     */
    enterGroupReplicationPassword?: (ctx: GroupReplicationPasswordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.groupReplicationPassword`.
     * @param ctx the parse tree
     */
    exitGroupReplicationPassword?: (ctx: GroupReplicationPasswordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.groupReplicationPluginAuth`.
     * @param ctx the parse tree
     */
    enterGroupReplicationPluginAuth?: (ctx: GroupReplicationPluginAuthContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.groupReplicationPluginAuth`.
     * @param ctx the parse tree
     */
    exitGroupReplicationPluginAuth?: (ctx: GroupReplicationPluginAuthContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.replica`.
     * @param ctx the parse tree
     */
    enterReplica?: (ctx: ReplicaContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.replica`.
     * @param ctx the parse tree
     */
    exitReplica?: (ctx: ReplicaContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.preparedStatement`.
     * @param ctx the parse tree
     */
    enterPreparedStatement?: (ctx: PreparedStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.preparedStatement`.
     * @param ctx the parse tree
     */
    exitPreparedStatement?: (ctx: PreparedStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.executeStatement`.
     * @param ctx the parse tree
     */
    enterExecuteStatement?: (ctx: ExecuteStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.executeStatement`.
     * @param ctx the parse tree
     */
    exitExecuteStatement?: (ctx: ExecuteStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.executeVarList`.
     * @param ctx the parse tree
     */
    enterExecuteVarList?: (ctx: ExecuteVarListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.executeVarList`.
     * @param ctx the parse tree
     */
    exitExecuteVarList?: (ctx: ExecuteVarListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.cloneStatement`.
     * @param ctx the parse tree
     */
    enterCloneStatement?: (ctx: CloneStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.cloneStatement`.
     * @param ctx the parse tree
     */
    exitCloneStatement?: (ctx: CloneStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dataDirSSL`.
     * @param ctx the parse tree
     */
    enterDataDirSSL?: (ctx: DataDirSSLContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dataDirSSL`.
     * @param ctx the parse tree
     */
    exitDataDirSSL?: (ctx: DataDirSSLContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.ssl`.
     * @param ctx the parse tree
     */
    enterSsl?: (ctx: SslContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.ssl`.
     * @param ctx the parse tree
     */
    exitSsl?: (ctx: SslContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.accountManagementStatement`.
     * @param ctx the parse tree
     */
    enterAccountManagementStatement?: (ctx: AccountManagementStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.accountManagementStatement`.
     * @param ctx the parse tree
     */
    exitAccountManagementStatement?: (ctx: AccountManagementStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterUserStatement`.
     * @param ctx the parse tree
     */
    enterAlterUserStatement?: (ctx: AlterUserStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterUserStatement`.
     * @param ctx the parse tree
     */
    exitAlterUserStatement?: (ctx: AlterUserStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterUserList`.
     * @param ctx the parse tree
     */
    enterAlterUserList?: (ctx: AlterUserListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterUserList`.
     * @param ctx the parse tree
     */
    exitAlterUserList?: (ctx: AlterUserListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterUser`.
     * @param ctx the parse tree
     */
    enterAlterUser?: (ctx: AlterUserContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterUser`.
     * @param ctx the parse tree
     */
    exitAlterUser?: (ctx: AlterUserContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.oldAlterUser`.
     * @param ctx the parse tree
     */
    enterOldAlterUser?: (ctx: OldAlterUserContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.oldAlterUser`.
     * @param ctx the parse tree
     */
    exitOldAlterUser?: (ctx: OldAlterUserContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.userFunction`.
     * @param ctx the parse tree
     */
    enterUserFunction?: (ctx: UserFunctionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.userFunction`.
     * @param ctx the parse tree
     */
    exitUserFunction?: (ctx: UserFunctionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createUserStatement`.
     * @param ctx the parse tree
     */
    enterCreateUserStatement?: (ctx: CreateUserStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createUserStatement`.
     * @param ctx the parse tree
     */
    exitCreateUserStatement?: (ctx: CreateUserStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createUserTail`.
     * @param ctx the parse tree
     */
    enterCreateUserTail?: (ctx: CreateUserTailContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createUserTail`.
     * @param ctx the parse tree
     */
    exitCreateUserTail?: (ctx: CreateUserTailContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.userAttributes`.
     * @param ctx the parse tree
     */
    enterUserAttributes?: (ctx: UserAttributesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.userAttributes`.
     * @param ctx the parse tree
     */
    exitUserAttributes?: (ctx: UserAttributesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.defaultRoleClause`.
     * @param ctx the parse tree
     */
    enterDefaultRoleClause?: (ctx: DefaultRoleClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.defaultRoleClause`.
     * @param ctx the parse tree
     */
    exitDefaultRoleClause?: (ctx: DefaultRoleClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.requireClause`.
     * @param ctx the parse tree
     */
    enterRequireClause?: (ctx: RequireClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.requireClause`.
     * @param ctx the parse tree
     */
    exitRequireClause?: (ctx: RequireClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.connectOptions`.
     * @param ctx the parse tree
     */
    enterConnectOptions?: (ctx: ConnectOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.connectOptions`.
     * @param ctx the parse tree
     */
    exitConnectOptions?: (ctx: ConnectOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.accountLockPasswordExpireOptions`.
     * @param ctx the parse tree
     */
    enterAccountLockPasswordExpireOptions?: (ctx: AccountLockPasswordExpireOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.accountLockPasswordExpireOptions`.
     * @param ctx the parse tree
     */
    exitAccountLockPasswordExpireOptions?: (ctx: AccountLockPasswordExpireOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.userAttribute`.
     * @param ctx the parse tree
     */
    enterUserAttribute?: (ctx: UserAttributeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.userAttribute`.
     * @param ctx the parse tree
     */
    exitUserAttribute?: (ctx: UserAttributeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropUserStatement`.
     * @param ctx the parse tree
     */
    enterDropUserStatement?: (ctx: DropUserStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropUserStatement`.
     * @param ctx the parse tree
     */
    exitDropUserStatement?: (ctx: DropUserStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.grantStatement`.
     * @param ctx the parse tree
     */
    enterGrantStatement?: (ctx: GrantStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.grantStatement`.
     * @param ctx the parse tree
     */
    exitGrantStatement?: (ctx: GrantStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.grantTargetList`.
     * @param ctx the parse tree
     */
    enterGrantTargetList?: (ctx: GrantTargetListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.grantTargetList`.
     * @param ctx the parse tree
     */
    exitGrantTargetList?: (ctx: GrantTargetListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.grantOptions`.
     * @param ctx the parse tree
     */
    enterGrantOptions?: (ctx: GrantOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.grantOptions`.
     * @param ctx the parse tree
     */
    exitGrantOptions?: (ctx: GrantOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.exceptRoleList`.
     * @param ctx the parse tree
     */
    enterExceptRoleList?: (ctx: ExceptRoleListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.exceptRoleList`.
     * @param ctx the parse tree
     */
    exitExceptRoleList?: (ctx: ExceptRoleListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.withRoles`.
     * @param ctx the parse tree
     */
    enterWithRoles?: (ctx: WithRolesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.withRoles`.
     * @param ctx the parse tree
     */
    exitWithRoles?: (ctx: WithRolesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.grantAs`.
     * @param ctx the parse tree
     */
    enterGrantAs?: (ctx: GrantAsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.grantAs`.
     * @param ctx the parse tree
     */
    exitGrantAs?: (ctx: GrantAsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.versionedRequireClause`.
     * @param ctx the parse tree
     */
    enterVersionedRequireClause?: (ctx: VersionedRequireClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.versionedRequireClause`.
     * @param ctx the parse tree
     */
    exitVersionedRequireClause?: (ctx: VersionedRequireClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.renameUserStatement`.
     * @param ctx the parse tree
     */
    enterRenameUserStatement?: (ctx: RenameUserStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.renameUserStatement`.
     * @param ctx the parse tree
     */
    exitRenameUserStatement?: (ctx: RenameUserStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.revokeStatement`.
     * @param ctx the parse tree
     */
    enterRevokeStatement?: (ctx: RevokeStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.revokeStatement`.
     * @param ctx the parse tree
     */
    exitRevokeStatement?: (ctx: RevokeStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.aclType`.
     * @param ctx the parse tree
     */
    enterAclType?: (ctx: AclTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.aclType`.
     * @param ctx the parse tree
     */
    exitAclType?: (ctx: AclTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.roleOrPrivilegesList`.
     * @param ctx the parse tree
     */
    enterRoleOrPrivilegesList?: (ctx: RoleOrPrivilegesListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.roleOrPrivilegesList`.
     * @param ctx the parse tree
     */
    exitRoleOrPrivilegesList?: (ctx: RoleOrPrivilegesListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.roleOrPrivilege`.
     * @param ctx the parse tree
     */
    enterRoleOrPrivilege?: (ctx: RoleOrPrivilegeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.roleOrPrivilege`.
     * @param ctx the parse tree
     */
    exitRoleOrPrivilege?: (ctx: RoleOrPrivilegeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.grantIdentifier`.
     * @param ctx the parse tree
     */
    enterGrantIdentifier?: (ctx: GrantIdentifierContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.grantIdentifier`.
     * @param ctx the parse tree
     */
    exitGrantIdentifier?: (ctx: GrantIdentifierContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.requireList`.
     * @param ctx the parse tree
     */
    enterRequireList?: (ctx: RequireListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.requireList`.
     * @param ctx the parse tree
     */
    exitRequireList?: (ctx: RequireListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.requireListElement`.
     * @param ctx the parse tree
     */
    enterRequireListElement?: (ctx: RequireListElementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.requireListElement`.
     * @param ctx the parse tree
     */
    exitRequireListElement?: (ctx: RequireListElementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.grantOption`.
     * @param ctx the parse tree
     */
    enterGrantOption?: (ctx: GrantOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.grantOption`.
     * @param ctx the parse tree
     */
    exitGrantOption?: (ctx: GrantOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.setRoleStatement`.
     * @param ctx the parse tree
     */
    enterSetRoleStatement?: (ctx: SetRoleStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.setRoleStatement`.
     * @param ctx the parse tree
     */
    exitSetRoleStatement?: (ctx: SetRoleStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.roleList`.
     * @param ctx the parse tree
     */
    enterRoleList?: (ctx: RoleListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.roleList`.
     * @param ctx the parse tree
     */
    exitRoleList?: (ctx: RoleListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.role`.
     * @param ctx the parse tree
     */
    enterRole?: (ctx: RoleContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.role`.
     * @param ctx the parse tree
     */
    exitRole?: (ctx: RoleContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableAdministrationStatement`.
     * @param ctx the parse tree
     */
    enterTableAdministrationStatement?: (ctx: TableAdministrationStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableAdministrationStatement`.
     * @param ctx the parse tree
     */
    exitTableAdministrationStatement?: (ctx: TableAdministrationStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.histogram`.
     * @param ctx the parse tree
     */
    enterHistogram?: (ctx: HistogramContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.histogram`.
     * @param ctx the parse tree
     */
    exitHistogram?: (ctx: HistogramContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.checkOption`.
     * @param ctx the parse tree
     */
    enterCheckOption?: (ctx: CheckOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.checkOption`.
     * @param ctx the parse tree
     */
    exitCheckOption?: (ctx: CheckOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.repairType`.
     * @param ctx the parse tree
     */
    enterRepairType?: (ctx: RepairTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.repairType`.
     * @param ctx the parse tree
     */
    exitRepairType?: (ctx: RepairTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.installUninstallStatement`.
     * @param ctx the parse tree
     */
    enterInstallUninstallStatement?: (ctx: InstallUninstallStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.installUninstallStatement`.
     * @param ctx the parse tree
     */
    exitInstallUninstallStatement?: (ctx: InstallUninstallStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.setStatement`.
     * @param ctx the parse tree
     */
    enterSetStatement?: (ctx: SetStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.setStatement`.
     * @param ctx the parse tree
     */
    exitSetStatement?: (ctx: SetStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.startOptionValueList`.
     * @param ctx the parse tree
     */
    enterStartOptionValueList?: (ctx: StartOptionValueListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.startOptionValueList`.
     * @param ctx the parse tree
     */
    exitStartOptionValueList?: (ctx: StartOptionValueListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.transactionCharacteristics`.
     * @param ctx the parse tree
     */
    enterTransactionCharacteristics?: (ctx: TransactionCharacteristicsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.transactionCharacteristics`.
     * @param ctx the parse tree
     */
    exitTransactionCharacteristics?: (ctx: TransactionCharacteristicsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.transactionAccessMode`.
     * @param ctx the parse tree
     */
    enterTransactionAccessMode?: (ctx: TransactionAccessModeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.transactionAccessMode`.
     * @param ctx the parse tree
     */
    exitTransactionAccessMode?: (ctx: TransactionAccessModeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.isolationLevel`.
     * @param ctx the parse tree
     */
    enterIsolationLevel?: (ctx: IsolationLevelContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.isolationLevel`.
     * @param ctx the parse tree
     */
    exitIsolationLevel?: (ctx: IsolationLevelContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.optionValueListContinued`.
     * @param ctx the parse tree
     */
    enterOptionValueListContinued?: (ctx: OptionValueListContinuedContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.optionValueListContinued`.
     * @param ctx the parse tree
     */
    exitOptionValueListContinued?: (ctx: OptionValueListContinuedContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.optionValueNoOptionType`.
     * @param ctx the parse tree
     */
    enterOptionValueNoOptionType?: (ctx: OptionValueNoOptionTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.optionValueNoOptionType`.
     * @param ctx the parse tree
     */
    exitOptionValueNoOptionType?: (ctx: OptionValueNoOptionTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.optionValue`.
     * @param ctx the parse tree
     */
    enterOptionValue?: (ctx: OptionValueContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.optionValue`.
     * @param ctx the parse tree
     */
    exitOptionValue?: (ctx: OptionValueContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.setSystemVariable`.
     * @param ctx the parse tree
     */
    enterSetSystemVariable?: (ctx: SetSystemVariableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.setSystemVariable`.
     * @param ctx the parse tree
     */
    exitSetSystemVariable?: (ctx: SetSystemVariableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.startOptionValueListFollowingOptionType`.
     * @param ctx the parse tree
     */
    enterStartOptionValueListFollowingOptionType?: (ctx: StartOptionValueListFollowingOptionTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.startOptionValueListFollowingOptionType`.
     * @param ctx the parse tree
     */
    exitStartOptionValueListFollowingOptionType?: (ctx: StartOptionValueListFollowingOptionTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.optionValueFollowingOptionType`.
     * @param ctx the parse tree
     */
    enterOptionValueFollowingOptionType?: (ctx: OptionValueFollowingOptionTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.optionValueFollowingOptionType`.
     * @param ctx the parse tree
     */
    exitOptionValueFollowingOptionType?: (ctx: OptionValueFollowingOptionTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.setExprOrDefault`.
     * @param ctx the parse tree
     */
    enterSetExprOrDefault?: (ctx: SetExprOrDefaultContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.setExprOrDefault`.
     * @param ctx the parse tree
     */
    exitSetExprOrDefault?: (ctx: SetExprOrDefaultContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showDatabasesStatement`.
     * @param ctx the parse tree
     */
    enterShowDatabasesStatement?: (ctx: ShowDatabasesStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showDatabasesStatement`.
     * @param ctx the parse tree
     */
    exitShowDatabasesStatement?: (ctx: ShowDatabasesStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showTablesStatement`.
     * @param ctx the parse tree
     */
    enterShowTablesStatement?: (ctx: ShowTablesStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showTablesStatement`.
     * @param ctx the parse tree
     */
    exitShowTablesStatement?: (ctx: ShowTablesStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showTriggersStatement`.
     * @param ctx the parse tree
     */
    enterShowTriggersStatement?: (ctx: ShowTriggersStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showTriggersStatement`.
     * @param ctx the parse tree
     */
    exitShowTriggersStatement?: (ctx: ShowTriggersStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showEventsStatement`.
     * @param ctx the parse tree
     */
    enterShowEventsStatement?: (ctx: ShowEventsStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showEventsStatement`.
     * @param ctx the parse tree
     */
    exitShowEventsStatement?: (ctx: ShowEventsStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showTableStatusStatement`.
     * @param ctx the parse tree
     */
    enterShowTableStatusStatement?: (ctx: ShowTableStatusStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showTableStatusStatement`.
     * @param ctx the parse tree
     */
    exitShowTableStatusStatement?: (ctx: ShowTableStatusStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showOpenTablesStatement`.
     * @param ctx the parse tree
     */
    enterShowOpenTablesStatement?: (ctx: ShowOpenTablesStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showOpenTablesStatement`.
     * @param ctx the parse tree
     */
    exitShowOpenTablesStatement?: (ctx: ShowOpenTablesStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showPluginsStatement`.
     * @param ctx the parse tree
     */
    enterShowPluginsStatement?: (ctx: ShowPluginsStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showPluginsStatement`.
     * @param ctx the parse tree
     */
    exitShowPluginsStatement?: (ctx: ShowPluginsStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showEngineLogsStatement`.
     * @param ctx the parse tree
     */
    enterShowEngineLogsStatement?: (ctx: ShowEngineLogsStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showEngineLogsStatement`.
     * @param ctx the parse tree
     */
    exitShowEngineLogsStatement?: (ctx: ShowEngineLogsStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showEngineMutexStatement`.
     * @param ctx the parse tree
     */
    enterShowEngineMutexStatement?: (ctx: ShowEngineMutexStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showEngineMutexStatement`.
     * @param ctx the parse tree
     */
    exitShowEngineMutexStatement?: (ctx: ShowEngineMutexStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showEngineStatusStatement`.
     * @param ctx the parse tree
     */
    enterShowEngineStatusStatement?: (ctx: ShowEngineStatusStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showEngineStatusStatement`.
     * @param ctx the parse tree
     */
    exitShowEngineStatusStatement?: (ctx: ShowEngineStatusStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showColumnsStatement`.
     * @param ctx the parse tree
     */
    enterShowColumnsStatement?: (ctx: ShowColumnsStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showColumnsStatement`.
     * @param ctx the parse tree
     */
    exitShowColumnsStatement?: (ctx: ShowColumnsStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showBinaryLogsStatement`.
     * @param ctx the parse tree
     */
    enterShowBinaryLogsStatement?: (ctx: ShowBinaryLogsStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showBinaryLogsStatement`.
     * @param ctx the parse tree
     */
    exitShowBinaryLogsStatement?: (ctx: ShowBinaryLogsStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showReplicasStatement`.
     * @param ctx the parse tree
     */
    enterShowReplicasStatement?: (ctx: ShowReplicasStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showReplicasStatement`.
     * @param ctx the parse tree
     */
    exitShowReplicasStatement?: (ctx: ShowReplicasStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showBinlogEventsStatement`.
     * @param ctx the parse tree
     */
    enterShowBinlogEventsStatement?: (ctx: ShowBinlogEventsStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showBinlogEventsStatement`.
     * @param ctx the parse tree
     */
    exitShowBinlogEventsStatement?: (ctx: ShowBinlogEventsStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showRelaylogEventsStatement`.
     * @param ctx the parse tree
     */
    enterShowRelaylogEventsStatement?: (ctx: ShowRelaylogEventsStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showRelaylogEventsStatement`.
     * @param ctx the parse tree
     */
    exitShowRelaylogEventsStatement?: (ctx: ShowRelaylogEventsStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showKeysStatement`.
     * @param ctx the parse tree
     */
    enterShowKeysStatement?: (ctx: ShowKeysStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showKeysStatement`.
     * @param ctx the parse tree
     */
    exitShowKeysStatement?: (ctx: ShowKeysStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showEnginesStatement`.
     * @param ctx the parse tree
     */
    enterShowEnginesStatement?: (ctx: ShowEnginesStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showEnginesStatement`.
     * @param ctx the parse tree
     */
    exitShowEnginesStatement?: (ctx: ShowEnginesStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCountWarningsStatement`.
     * @param ctx the parse tree
     */
    enterShowCountWarningsStatement?: (ctx: ShowCountWarningsStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCountWarningsStatement`.
     * @param ctx the parse tree
     */
    exitShowCountWarningsStatement?: (ctx: ShowCountWarningsStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCountErrorsStatement`.
     * @param ctx the parse tree
     */
    enterShowCountErrorsStatement?: (ctx: ShowCountErrorsStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCountErrorsStatement`.
     * @param ctx the parse tree
     */
    exitShowCountErrorsStatement?: (ctx: ShowCountErrorsStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showWarningsStatement`.
     * @param ctx the parse tree
     */
    enterShowWarningsStatement?: (ctx: ShowWarningsStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showWarningsStatement`.
     * @param ctx the parse tree
     */
    exitShowWarningsStatement?: (ctx: ShowWarningsStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showErrorsStatement`.
     * @param ctx the parse tree
     */
    enterShowErrorsStatement?: (ctx: ShowErrorsStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showErrorsStatement`.
     * @param ctx the parse tree
     */
    exitShowErrorsStatement?: (ctx: ShowErrorsStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showProfilesStatement`.
     * @param ctx the parse tree
     */
    enterShowProfilesStatement?: (ctx: ShowProfilesStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showProfilesStatement`.
     * @param ctx the parse tree
     */
    exitShowProfilesStatement?: (ctx: ShowProfilesStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showProfileStatement`.
     * @param ctx the parse tree
     */
    enterShowProfileStatement?: (ctx: ShowProfileStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showProfileStatement`.
     * @param ctx the parse tree
     */
    exitShowProfileStatement?: (ctx: ShowProfileStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showStatusStatement`.
     * @param ctx the parse tree
     */
    enterShowStatusStatement?: (ctx: ShowStatusStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showStatusStatement`.
     * @param ctx the parse tree
     */
    exitShowStatusStatement?: (ctx: ShowStatusStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showProcessListStatement`.
     * @param ctx the parse tree
     */
    enterShowProcessListStatement?: (ctx: ShowProcessListStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showProcessListStatement`.
     * @param ctx the parse tree
     */
    exitShowProcessListStatement?: (ctx: ShowProcessListStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showVariablesStatement`.
     * @param ctx the parse tree
     */
    enterShowVariablesStatement?: (ctx: ShowVariablesStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showVariablesStatement`.
     * @param ctx the parse tree
     */
    exitShowVariablesStatement?: (ctx: ShowVariablesStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCharacterSetStatement`.
     * @param ctx the parse tree
     */
    enterShowCharacterSetStatement?: (ctx: ShowCharacterSetStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCharacterSetStatement`.
     * @param ctx the parse tree
     */
    exitShowCharacterSetStatement?: (ctx: ShowCharacterSetStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCollationStatement`.
     * @param ctx the parse tree
     */
    enterShowCollationStatement?: (ctx: ShowCollationStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCollationStatement`.
     * @param ctx the parse tree
     */
    exitShowCollationStatement?: (ctx: ShowCollationStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showPrivilegesStatement`.
     * @param ctx the parse tree
     */
    enterShowPrivilegesStatement?: (ctx: ShowPrivilegesStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showPrivilegesStatement`.
     * @param ctx the parse tree
     */
    exitShowPrivilegesStatement?: (ctx: ShowPrivilegesStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showGrantsStatement`.
     * @param ctx the parse tree
     */
    enterShowGrantsStatement?: (ctx: ShowGrantsStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showGrantsStatement`.
     * @param ctx the parse tree
     */
    exitShowGrantsStatement?: (ctx: ShowGrantsStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCreateDatabaseStatement`.
     * @param ctx the parse tree
     */
    enterShowCreateDatabaseStatement?: (ctx: ShowCreateDatabaseStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCreateDatabaseStatement`.
     * @param ctx the parse tree
     */
    exitShowCreateDatabaseStatement?: (ctx: ShowCreateDatabaseStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCreateTableStatement`.
     * @param ctx the parse tree
     */
    enterShowCreateTableStatement?: (ctx: ShowCreateTableStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCreateTableStatement`.
     * @param ctx the parse tree
     */
    exitShowCreateTableStatement?: (ctx: ShowCreateTableStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCreateViewStatement`.
     * @param ctx the parse tree
     */
    enterShowCreateViewStatement?: (ctx: ShowCreateViewStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCreateViewStatement`.
     * @param ctx the parse tree
     */
    exitShowCreateViewStatement?: (ctx: ShowCreateViewStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showMasterStatusStatement`.
     * @param ctx the parse tree
     */
    enterShowMasterStatusStatement?: (ctx: ShowMasterStatusStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showMasterStatusStatement`.
     * @param ctx the parse tree
     */
    exitShowMasterStatusStatement?: (ctx: ShowMasterStatusStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showReplicaStatusStatement`.
     * @param ctx the parse tree
     */
    enterShowReplicaStatusStatement?: (ctx: ShowReplicaStatusStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showReplicaStatusStatement`.
     * @param ctx the parse tree
     */
    exitShowReplicaStatusStatement?: (ctx: ShowReplicaStatusStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCreateProcedureStatement`.
     * @param ctx the parse tree
     */
    enterShowCreateProcedureStatement?: (ctx: ShowCreateProcedureStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCreateProcedureStatement`.
     * @param ctx the parse tree
     */
    exitShowCreateProcedureStatement?: (ctx: ShowCreateProcedureStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCreateFunctionStatement`.
     * @param ctx the parse tree
     */
    enterShowCreateFunctionStatement?: (ctx: ShowCreateFunctionStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCreateFunctionStatement`.
     * @param ctx the parse tree
     */
    exitShowCreateFunctionStatement?: (ctx: ShowCreateFunctionStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCreateTriggerStatement`.
     * @param ctx the parse tree
     */
    enterShowCreateTriggerStatement?: (ctx: ShowCreateTriggerStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCreateTriggerStatement`.
     * @param ctx the parse tree
     */
    exitShowCreateTriggerStatement?: (ctx: ShowCreateTriggerStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCreateProcedureStatusStatement`.
     * @param ctx the parse tree
     */
    enterShowCreateProcedureStatusStatement?: (ctx: ShowCreateProcedureStatusStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCreateProcedureStatusStatement`.
     * @param ctx the parse tree
     */
    exitShowCreateProcedureStatusStatement?: (ctx: ShowCreateProcedureStatusStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCreateFunctionStatusStatement`.
     * @param ctx the parse tree
     */
    enterShowCreateFunctionStatusStatement?: (ctx: ShowCreateFunctionStatusStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCreateFunctionStatusStatement`.
     * @param ctx the parse tree
     */
    exitShowCreateFunctionStatusStatement?: (ctx: ShowCreateFunctionStatusStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCreateProcedureCodeStatement`.
     * @param ctx the parse tree
     */
    enterShowCreateProcedureCodeStatement?: (ctx: ShowCreateProcedureCodeStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCreateProcedureCodeStatement`.
     * @param ctx the parse tree
     */
    exitShowCreateProcedureCodeStatement?: (ctx: ShowCreateProcedureCodeStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCreateFunctionCodeStatement`.
     * @param ctx the parse tree
     */
    enterShowCreateFunctionCodeStatement?: (ctx: ShowCreateFunctionCodeStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCreateFunctionCodeStatement`.
     * @param ctx the parse tree
     */
    exitShowCreateFunctionCodeStatement?: (ctx: ShowCreateFunctionCodeStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCreateEventStatement`.
     * @param ctx the parse tree
     */
    enterShowCreateEventStatement?: (ctx: ShowCreateEventStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCreateEventStatement`.
     * @param ctx the parse tree
     */
    exitShowCreateEventStatement?: (ctx: ShowCreateEventStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCreateUserStatement`.
     * @param ctx the parse tree
     */
    enterShowCreateUserStatement?: (ctx: ShowCreateUserStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCreateUserStatement`.
     * @param ctx the parse tree
     */
    exitShowCreateUserStatement?: (ctx: ShowCreateUserStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.showCommandType`.
     * @param ctx the parse tree
     */
    enterShowCommandType?: (ctx: ShowCommandTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.showCommandType`.
     * @param ctx the parse tree
     */
    exitShowCommandType?: (ctx: ShowCommandTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.engineOrAll`.
     * @param ctx the parse tree
     */
    enterEngineOrAll?: (ctx: EngineOrAllContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.engineOrAll`.
     * @param ctx the parse tree
     */
    exitEngineOrAll?: (ctx: EngineOrAllContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.fromOrIn`.
     * @param ctx the parse tree
     */
    enterFromOrIn?: (ctx: FromOrInContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.fromOrIn`.
     * @param ctx the parse tree
     */
    exitFromOrIn?: (ctx: FromOrInContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.inDb`.
     * @param ctx the parse tree
     */
    enterInDb?: (ctx: InDbContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.inDb`.
     * @param ctx the parse tree
     */
    exitInDb?: (ctx: InDbContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.profileDefinitions`.
     * @param ctx the parse tree
     */
    enterProfileDefinitions?: (ctx: ProfileDefinitionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.profileDefinitions`.
     * @param ctx the parse tree
     */
    exitProfileDefinitions?: (ctx: ProfileDefinitionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.profileDefinition`.
     * @param ctx the parse tree
     */
    enterProfileDefinition?: (ctx: ProfileDefinitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.profileDefinition`.
     * @param ctx the parse tree
     */
    exitProfileDefinition?: (ctx: ProfileDefinitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.otherAdministrativeStatement`.
     * @param ctx the parse tree
     */
    enterOtherAdministrativeStatement?: (ctx: OtherAdministrativeStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.otherAdministrativeStatement`.
     * @param ctx the parse tree
     */
    exitOtherAdministrativeStatement?: (ctx: OtherAdministrativeStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.keyCacheListOrParts`.
     * @param ctx the parse tree
     */
    enterKeyCacheListOrParts?: (ctx: KeyCacheListOrPartsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.keyCacheListOrParts`.
     * @param ctx the parse tree
     */
    exitKeyCacheListOrParts?: (ctx: KeyCacheListOrPartsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.keyCacheList`.
     * @param ctx the parse tree
     */
    enterKeyCacheList?: (ctx: KeyCacheListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.keyCacheList`.
     * @param ctx the parse tree
     */
    exitKeyCacheList?: (ctx: KeyCacheListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.assignToKeycache`.
     * @param ctx the parse tree
     */
    enterAssignToKeycache?: (ctx: AssignToKeycacheContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.assignToKeycache`.
     * @param ctx the parse tree
     */
    exitAssignToKeycache?: (ctx: AssignToKeycacheContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.assignToKeycachePartition`.
     * @param ctx the parse tree
     */
    enterAssignToKeycachePartition?: (ctx: AssignToKeycachePartitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.assignToKeycachePartition`.
     * @param ctx the parse tree
     */
    exitAssignToKeycachePartition?: (ctx: AssignToKeycachePartitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.cacheKeyList`.
     * @param ctx the parse tree
     */
    enterCacheKeyList?: (ctx: CacheKeyListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.cacheKeyList`.
     * @param ctx the parse tree
     */
    exitCacheKeyList?: (ctx: CacheKeyListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.keyUsageElement`.
     * @param ctx the parse tree
     */
    enterKeyUsageElement?: (ctx: KeyUsageElementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.keyUsageElement`.
     * @param ctx the parse tree
     */
    exitKeyUsageElement?: (ctx: KeyUsageElementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.keyUsageList`.
     * @param ctx the parse tree
     */
    enterKeyUsageList?: (ctx: KeyUsageListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.keyUsageList`.
     * @param ctx the parse tree
     */
    exitKeyUsageList?: (ctx: KeyUsageListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.flushOption`.
     * @param ctx the parse tree
     */
    enterFlushOption?: (ctx: FlushOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.flushOption`.
     * @param ctx the parse tree
     */
    exitFlushOption?: (ctx: FlushOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.logType`.
     * @param ctx the parse tree
     */
    enterLogType?: (ctx: LogTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.logType`.
     * @param ctx the parse tree
     */
    exitLogType?: (ctx: LogTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.flushTables`.
     * @param ctx the parse tree
     */
    enterFlushTables?: (ctx: FlushTablesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.flushTables`.
     * @param ctx the parse tree
     */
    exitFlushTables?: (ctx: FlushTablesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.flushTablesOptions`.
     * @param ctx the parse tree
     */
    enterFlushTablesOptions?: (ctx: FlushTablesOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.flushTablesOptions`.
     * @param ctx the parse tree
     */
    exitFlushTablesOptions?: (ctx: FlushTablesOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.preloadTail`.
     * @param ctx the parse tree
     */
    enterPreloadTail?: (ctx: PreloadTailContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.preloadTail`.
     * @param ctx the parse tree
     */
    exitPreloadTail?: (ctx: PreloadTailContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.preloadList`.
     * @param ctx the parse tree
     */
    enterPreloadList?: (ctx: PreloadListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.preloadList`.
     * @param ctx the parse tree
     */
    exitPreloadList?: (ctx: PreloadListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.preloadKeys`.
     * @param ctx the parse tree
     */
    enterPreloadKeys?: (ctx: PreloadKeysContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.preloadKeys`.
     * @param ctx the parse tree
     */
    exitPreloadKeys?: (ctx: PreloadKeysContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.adminPartition`.
     * @param ctx the parse tree
     */
    enterAdminPartition?: (ctx: AdminPartitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.adminPartition`.
     * @param ctx the parse tree
     */
    exitAdminPartition?: (ctx: AdminPartitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.resourceGroupManagement`.
     * @param ctx the parse tree
     */
    enterResourceGroupManagement?: (ctx: ResourceGroupManagementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.resourceGroupManagement`.
     * @param ctx the parse tree
     */
    exitResourceGroupManagement?: (ctx: ResourceGroupManagementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createResourceGroup`.
     * @param ctx the parse tree
     */
    enterCreateResourceGroup?: (ctx: CreateResourceGroupContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createResourceGroup`.
     * @param ctx the parse tree
     */
    exitCreateResourceGroup?: (ctx: CreateResourceGroupContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.resourceGroupVcpuList`.
     * @param ctx the parse tree
     */
    enterResourceGroupVcpuList?: (ctx: ResourceGroupVcpuListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.resourceGroupVcpuList`.
     * @param ctx the parse tree
     */
    exitResourceGroupVcpuList?: (ctx: ResourceGroupVcpuListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.vcpuNumOrRange`.
     * @param ctx the parse tree
     */
    enterVcpuNumOrRange?: (ctx: VcpuNumOrRangeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.vcpuNumOrRange`.
     * @param ctx the parse tree
     */
    exitVcpuNumOrRange?: (ctx: VcpuNumOrRangeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.resourceGroupPriority`.
     * @param ctx the parse tree
     */
    enterResourceGroupPriority?: (ctx: ResourceGroupPriorityContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.resourceGroupPriority`.
     * @param ctx the parse tree
     */
    exitResourceGroupPriority?: (ctx: ResourceGroupPriorityContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.resourceGroupEnableDisable`.
     * @param ctx the parse tree
     */
    enterResourceGroupEnableDisable?: (ctx: ResourceGroupEnableDisableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.resourceGroupEnableDisable`.
     * @param ctx the parse tree
     */
    exitResourceGroupEnableDisable?: (ctx: ResourceGroupEnableDisableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.alterResourceGroup`.
     * @param ctx the parse tree
     */
    enterAlterResourceGroup?: (ctx: AlterResourceGroupContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.alterResourceGroup`.
     * @param ctx the parse tree
     */
    exitAlterResourceGroup?: (ctx: AlterResourceGroupContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.setResourceGroup`.
     * @param ctx the parse tree
     */
    enterSetResourceGroup?: (ctx: SetResourceGroupContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.setResourceGroup`.
     * @param ctx the parse tree
     */
    exitSetResourceGroup?: (ctx: SetResourceGroupContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.threadIdList`.
     * @param ctx the parse tree
     */
    enterThreadIdList?: (ctx: ThreadIdListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.threadIdList`.
     * @param ctx the parse tree
     */
    exitThreadIdList?: (ctx: ThreadIdListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dropResourceGroup`.
     * @param ctx the parse tree
     */
    enterDropResourceGroup?: (ctx: DropResourceGroupContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dropResourceGroup`.
     * @param ctx the parse tree
     */
    exitDropResourceGroup?: (ctx: DropResourceGroupContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.utilityStatement`.
     * @param ctx the parse tree
     */
    enterUtilityStatement?: (ctx: UtilityStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.utilityStatement`.
     * @param ctx the parse tree
     */
    exitUtilityStatement?: (ctx: UtilityStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.describeStatement`.
     * @param ctx the parse tree
     */
    enterDescribeStatement?: (ctx: DescribeStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.describeStatement`.
     * @param ctx the parse tree
     */
    exitDescribeStatement?: (ctx: DescribeStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.explainStatement`.
     * @param ctx the parse tree
     */
    enterExplainStatement?: (ctx: ExplainStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.explainStatement`.
     * @param ctx the parse tree
     */
    exitExplainStatement?: (ctx: ExplainStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.explainableStatement`.
     * @param ctx the parse tree
     */
    enterExplainableStatement?: (ctx: ExplainableStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.explainableStatement`.
     * @param ctx the parse tree
     */
    exitExplainableStatement?: (ctx: ExplainableStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.helpCommand`.
     * @param ctx the parse tree
     */
    enterHelpCommand?: (ctx: HelpCommandContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.helpCommand`.
     * @param ctx the parse tree
     */
    exitHelpCommand?: (ctx: HelpCommandContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.useCommand`.
     * @param ctx the parse tree
     */
    enterUseCommand?: (ctx: UseCommandContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.useCommand`.
     * @param ctx the parse tree
     */
    exitUseCommand?: (ctx: UseCommandContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.restartServer`.
     * @param ctx the parse tree
     */
    enterRestartServer?: (ctx: RestartServerContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.restartServer`.
     * @param ctx the parse tree
     */
    exitRestartServer?: (ctx: RestartServerContext) => void;
    /**
     * Enter a parse tree produced by the `exprOr`
     * labeled alternative in `MySQLParser.expr`.
     * @param ctx the parse tree
     */
    enterExprOr?: (ctx: ExprOrContext) => void;
    /**
     * Exit a parse tree produced by the `exprOr`
     * labeled alternative in `MySQLParser.expr`.
     * @param ctx the parse tree
     */
    exitExprOr?: (ctx: ExprOrContext) => void;
    /**
     * Enter a parse tree produced by the `exprNot`
     * labeled alternative in `MySQLParser.expr`.
     * @param ctx the parse tree
     */
    enterExprNot?: (ctx: ExprNotContext) => void;
    /**
     * Exit a parse tree produced by the `exprNot`
     * labeled alternative in `MySQLParser.expr`.
     * @param ctx the parse tree
     */
    exitExprNot?: (ctx: ExprNotContext) => void;
    /**
     * Enter a parse tree produced by the `exprIs`
     * labeled alternative in `MySQLParser.expr`.
     * @param ctx the parse tree
     */
    enterExprIs?: (ctx: ExprIsContext) => void;
    /**
     * Exit a parse tree produced by the `exprIs`
     * labeled alternative in `MySQLParser.expr`.
     * @param ctx the parse tree
     */
    exitExprIs?: (ctx: ExprIsContext) => void;
    /**
     * Enter a parse tree produced by the `exprAnd`
     * labeled alternative in `MySQLParser.expr`.
     * @param ctx the parse tree
     */
    enterExprAnd?: (ctx: ExprAndContext) => void;
    /**
     * Exit a parse tree produced by the `exprAnd`
     * labeled alternative in `MySQLParser.expr`.
     * @param ctx the parse tree
     */
    exitExprAnd?: (ctx: ExprAndContext) => void;
    /**
     * Enter a parse tree produced by the `exprXor`
     * labeled alternative in `MySQLParser.expr`.
     * @param ctx the parse tree
     */
    enterExprXor?: (ctx: ExprXorContext) => void;
    /**
     * Exit a parse tree produced by the `exprXor`
     * labeled alternative in `MySQLParser.expr`.
     * @param ctx the parse tree
     */
    exitExprXor?: (ctx: ExprXorContext) => void;
    /**
     * Enter a parse tree produced by the `primaryExprPredicate`
     * labeled alternative in `MySQLParser.boolPri`.
     * @param ctx the parse tree
     */
    enterPrimaryExprPredicate?: (ctx: PrimaryExprPredicateContext) => void;
    /**
     * Exit a parse tree produced by the `primaryExprPredicate`
     * labeled alternative in `MySQLParser.boolPri`.
     * @param ctx the parse tree
     */
    exitPrimaryExprPredicate?: (ctx: PrimaryExprPredicateContext) => void;
    /**
     * Enter a parse tree produced by the `primaryExprCompare`
     * labeled alternative in `MySQLParser.boolPri`.
     * @param ctx the parse tree
     */
    enterPrimaryExprCompare?: (ctx: PrimaryExprCompareContext) => void;
    /**
     * Exit a parse tree produced by the `primaryExprCompare`
     * labeled alternative in `MySQLParser.boolPri`.
     * @param ctx the parse tree
     */
    exitPrimaryExprCompare?: (ctx: PrimaryExprCompareContext) => void;
    /**
     * Enter a parse tree produced by the `primaryExprAllAny`
     * labeled alternative in `MySQLParser.boolPri`.
     * @param ctx the parse tree
     */
    enterPrimaryExprAllAny?: (ctx: PrimaryExprAllAnyContext) => void;
    /**
     * Exit a parse tree produced by the `primaryExprAllAny`
     * labeled alternative in `MySQLParser.boolPri`.
     * @param ctx the parse tree
     */
    exitPrimaryExprAllAny?: (ctx: PrimaryExprAllAnyContext) => void;
    /**
     * Enter a parse tree produced by the `primaryExprIsNull`
     * labeled alternative in `MySQLParser.boolPri`.
     * @param ctx the parse tree
     */
    enterPrimaryExprIsNull?: (ctx: PrimaryExprIsNullContext) => void;
    /**
     * Exit a parse tree produced by the `primaryExprIsNull`
     * labeled alternative in `MySQLParser.boolPri`.
     * @param ctx the parse tree
     */
    exitPrimaryExprIsNull?: (ctx: PrimaryExprIsNullContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.compOp`.
     * @param ctx the parse tree
     */
    enterCompOp?: (ctx: CompOpContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.compOp`.
     * @param ctx the parse tree
     */
    exitCompOp?: (ctx: CompOpContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.predicate`.
     * @param ctx the parse tree
     */
    enterPredicate?: (ctx: PredicateContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.predicate`.
     * @param ctx the parse tree
     */
    exitPredicate?: (ctx: PredicateContext) => void;
    /**
     * Enter a parse tree produced by the `predicateExprIn`
     * labeled alternative in `MySQLParser.predicateOperations`.
     * @param ctx the parse tree
     */
    enterPredicateExprIn?: (ctx: PredicateExprInContext) => void;
    /**
     * Exit a parse tree produced by the `predicateExprIn`
     * labeled alternative in `MySQLParser.predicateOperations`.
     * @param ctx the parse tree
     */
    exitPredicateExprIn?: (ctx: PredicateExprInContext) => void;
    /**
     * Enter a parse tree produced by the `predicateExprBetween`
     * labeled alternative in `MySQLParser.predicateOperations`.
     * @param ctx the parse tree
     */
    enterPredicateExprBetween?: (ctx: PredicateExprBetweenContext) => void;
    /**
     * Exit a parse tree produced by the `predicateExprBetween`
     * labeled alternative in `MySQLParser.predicateOperations`.
     * @param ctx the parse tree
     */
    exitPredicateExprBetween?: (ctx: PredicateExprBetweenContext) => void;
    /**
     * Enter a parse tree produced by the `predicateExprLike`
     * labeled alternative in `MySQLParser.predicateOperations`.
     * @param ctx the parse tree
     */
    enterPredicateExprLike?: (ctx: PredicateExprLikeContext) => void;
    /**
     * Exit a parse tree produced by the `predicateExprLike`
     * labeled alternative in `MySQLParser.predicateOperations`.
     * @param ctx the parse tree
     */
    exitPredicateExprLike?: (ctx: PredicateExprLikeContext) => void;
    /**
     * Enter a parse tree produced by the `predicateExprRegex`
     * labeled alternative in `MySQLParser.predicateOperations`.
     * @param ctx the parse tree
     */
    enterPredicateExprRegex?: (ctx: PredicateExprRegexContext) => void;
    /**
     * Exit a parse tree produced by the `predicateExprRegex`
     * labeled alternative in `MySQLParser.predicateOperations`.
     * @param ctx the parse tree
     */
    exitPredicateExprRegex?: (ctx: PredicateExprRegexContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.bitExpr`.
     * @param ctx the parse tree
     */
    enterBitExpr?: (ctx: BitExprContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.bitExpr`.
     * @param ctx the parse tree
     */
    exitBitExpr?: (ctx: BitExprContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprConvert`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprConvert?: (ctx: SimpleExprConvertContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprConvert`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprConvert?: (ctx: SimpleExprConvertContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprCast`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprCast?: (ctx: SimpleExprCastContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprCast`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprCast?: (ctx: SimpleExprCastContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprUnary`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprUnary?: (ctx: SimpleExprUnaryContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprUnary`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprUnary?: (ctx: SimpleExprUnaryContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExpressionRValue`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExpressionRValue?: (ctx: SimpleExpressionRValueContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExpressionRValue`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExpressionRValue?: (ctx: SimpleExpressionRValueContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprOdbc`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprOdbc?: (ctx: SimpleExprOdbcContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprOdbc`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprOdbc?: (ctx: SimpleExprOdbcContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprRuntimeFunction`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprRuntimeFunction?: (ctx: SimpleExprRuntimeFunctionContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprRuntimeFunction`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprRuntimeFunction?: (ctx: SimpleExprRuntimeFunctionContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprFunction`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprFunction?: (ctx: SimpleExprFunctionContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprFunction`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprFunction?: (ctx: SimpleExprFunctionContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprCollate`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprCollate?: (ctx: SimpleExprCollateContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprCollate`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprCollate?: (ctx: SimpleExprCollateContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprMatch`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprMatch?: (ctx: SimpleExprMatchContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprMatch`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprMatch?: (ctx: SimpleExprMatchContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprWindowingFunction`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprWindowingFunction?: (ctx: SimpleExprWindowingFunctionContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprWindowingFunction`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprWindowingFunction?: (ctx: SimpleExprWindowingFunctionContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprBinary`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprBinary?: (ctx: SimpleExprBinaryContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprBinary`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprBinary?: (ctx: SimpleExprBinaryContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprColumnRef`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprColumnRef?: (ctx: SimpleExprColumnRefContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprColumnRef`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprColumnRef?: (ctx: SimpleExprColumnRefContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprParamMarker`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprParamMarker?: (ctx: SimpleExprParamMarkerContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprParamMarker`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprParamMarker?: (ctx: SimpleExprParamMarkerContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprSum`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprSum?: (ctx: SimpleExprSumContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprSum`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprSum?: (ctx: SimpleExprSumContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprCastTime`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprCastTime?: (ctx: SimpleExprCastTimeContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprCastTime`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprCastTime?: (ctx: SimpleExprCastTimeContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprConvertUsing`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprConvertUsing?: (ctx: SimpleExprConvertUsingContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprConvertUsing`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprConvertUsing?: (ctx: SimpleExprConvertUsingContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprSubQuery`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprSubQuery?: (ctx: SimpleExprSubQueryContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprSubQuery`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprSubQuery?: (ctx: SimpleExprSubQueryContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprGroupingOperation`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprGroupingOperation?: (ctx: SimpleExprGroupingOperationContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprGroupingOperation`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprGroupingOperation?: (ctx: SimpleExprGroupingOperationContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprNot`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprNot?: (ctx: SimpleExprNotContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprNot`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprNot?: (ctx: SimpleExprNotContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprValues`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprValues?: (ctx: SimpleExprValuesContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprValues`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprValues?: (ctx: SimpleExprValuesContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprUserVariableAssignment`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprUserVariableAssignment?: (ctx: SimpleExprUserVariableAssignmentContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprUserVariableAssignment`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprUserVariableAssignment?: (ctx: SimpleExprUserVariableAssignmentContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprDefault`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprDefault?: (ctx: SimpleExprDefaultContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprDefault`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprDefault?: (ctx: SimpleExprDefaultContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprList`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprList?: (ctx: SimpleExprListContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprList`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprList?: (ctx: SimpleExprListContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprInterval`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprInterval?: (ctx: SimpleExprIntervalContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprInterval`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprInterval?: (ctx: SimpleExprIntervalContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprCase`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprCase?: (ctx: SimpleExprCaseContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprCase`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprCase?: (ctx: SimpleExprCaseContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprConcat`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprConcat?: (ctx: SimpleExprConcatContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprConcat`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprConcat?: (ctx: SimpleExprConcatContext) => void;
    /**
     * Enter a parse tree produced by the `simpleExprLiteral`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    enterSimpleExprLiteral?: (ctx: SimpleExprLiteralContext) => void;
    /**
     * Exit a parse tree produced by the `simpleExprLiteral`
     * labeled alternative in `MySQLParser.simpleExpr`.
     * @param ctx the parse tree
     */
    exitSimpleExprLiteral?: (ctx: SimpleExprLiteralContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.arrayCast`.
     * @param ctx the parse tree
     */
    enterArrayCast?: (ctx: ArrayCastContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.arrayCast`.
     * @param ctx the parse tree
     */
    exitArrayCast?: (ctx: ArrayCastContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.jsonOperator`.
     * @param ctx the parse tree
     */
    enterJsonOperator?: (ctx: JsonOperatorContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.jsonOperator`.
     * @param ctx the parse tree
     */
    exitJsonOperator?: (ctx: JsonOperatorContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.sumExpr`.
     * @param ctx the parse tree
     */
    enterSumExpr?: (ctx: SumExprContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.sumExpr`.
     * @param ctx the parse tree
     */
    exitSumExpr?: (ctx: SumExprContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.groupingOperation`.
     * @param ctx the parse tree
     */
    enterGroupingOperation?: (ctx: GroupingOperationContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.groupingOperation`.
     * @param ctx the parse tree
     */
    exitGroupingOperation?: (ctx: GroupingOperationContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowFunctionCall`.
     * @param ctx the parse tree
     */
    enterWindowFunctionCall?: (ctx: WindowFunctionCallContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowFunctionCall`.
     * @param ctx the parse tree
     */
    exitWindowFunctionCall?: (ctx: WindowFunctionCallContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowingClause`.
     * @param ctx the parse tree
     */
    enterWindowingClause?: (ctx: WindowingClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowingClause`.
     * @param ctx the parse tree
     */
    exitWindowingClause?: (ctx: WindowingClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.leadLagInfo`.
     * @param ctx the parse tree
     */
    enterLeadLagInfo?: (ctx: LeadLagInfoContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.leadLagInfo`.
     * @param ctx the parse tree
     */
    exitLeadLagInfo?: (ctx: LeadLagInfoContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.stableInteger`.
     * @param ctx the parse tree
     */
    enterStableInteger?: (ctx: StableIntegerContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.stableInteger`.
     * @param ctx the parse tree
     */
    exitStableInteger?: (ctx: StableIntegerContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.paramOrVar`.
     * @param ctx the parse tree
     */
    enterParamOrVar?: (ctx: ParamOrVarContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.paramOrVar`.
     * @param ctx the parse tree
     */
    exitParamOrVar?: (ctx: ParamOrVarContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.nullTreatment`.
     * @param ctx the parse tree
     */
    enterNullTreatment?: (ctx: NullTreatmentContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.nullTreatment`.
     * @param ctx the parse tree
     */
    exitNullTreatment?: (ctx: NullTreatmentContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.jsonFunction`.
     * @param ctx the parse tree
     */
    enterJsonFunction?: (ctx: JsonFunctionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.jsonFunction`.
     * @param ctx the parse tree
     */
    exitJsonFunction?: (ctx: JsonFunctionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.inSumExpr`.
     * @param ctx the parse tree
     */
    enterInSumExpr?: (ctx: InSumExprContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.inSumExpr`.
     * @param ctx the parse tree
     */
    exitInSumExpr?: (ctx: InSumExprContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identListArg`.
     * @param ctx the parse tree
     */
    enterIdentListArg?: (ctx: IdentListArgContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identListArg`.
     * @param ctx the parse tree
     */
    exitIdentListArg?: (ctx: IdentListArgContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identList`.
     * @param ctx the parse tree
     */
    enterIdentList?: (ctx: IdentListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identList`.
     * @param ctx the parse tree
     */
    exitIdentList?: (ctx: IdentListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.fulltextOptions`.
     * @param ctx the parse tree
     */
    enterFulltextOptions?: (ctx: FulltextOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.fulltextOptions`.
     * @param ctx the parse tree
     */
    exitFulltextOptions?: (ctx: FulltextOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.runtimeFunctionCall`.
     * @param ctx the parse tree
     */
    enterRuntimeFunctionCall?: (ctx: RuntimeFunctionCallContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.runtimeFunctionCall`.
     * @param ctx the parse tree
     */
    exitRuntimeFunctionCall?: (ctx: RuntimeFunctionCallContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.returningType`.
     * @param ctx the parse tree
     */
    enterReturningType?: (ctx: ReturningTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.returningType`.
     * @param ctx the parse tree
     */
    exitReturningType?: (ctx: ReturningTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.geometryFunction`.
     * @param ctx the parse tree
     */
    enterGeometryFunction?: (ctx: GeometryFunctionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.geometryFunction`.
     * @param ctx the parse tree
     */
    exitGeometryFunction?: (ctx: GeometryFunctionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.timeFunctionParameters`.
     * @param ctx the parse tree
     */
    enterTimeFunctionParameters?: (ctx: TimeFunctionParametersContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.timeFunctionParameters`.
     * @param ctx the parse tree
     */
    exitTimeFunctionParameters?: (ctx: TimeFunctionParametersContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.fractionalPrecision`.
     * @param ctx the parse tree
     */
    enterFractionalPrecision?: (ctx: FractionalPrecisionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.fractionalPrecision`.
     * @param ctx the parse tree
     */
    exitFractionalPrecision?: (ctx: FractionalPrecisionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.weightStringLevels`.
     * @param ctx the parse tree
     */
    enterWeightStringLevels?: (ctx: WeightStringLevelsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.weightStringLevels`.
     * @param ctx the parse tree
     */
    exitWeightStringLevels?: (ctx: WeightStringLevelsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.weightStringLevelListItem`.
     * @param ctx the parse tree
     */
    enterWeightStringLevelListItem?: (ctx: WeightStringLevelListItemContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.weightStringLevelListItem`.
     * @param ctx the parse tree
     */
    exitWeightStringLevelListItem?: (ctx: WeightStringLevelListItemContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dateTimeTtype`.
     * @param ctx the parse tree
     */
    enterDateTimeTtype?: (ctx: DateTimeTtypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dateTimeTtype`.
     * @param ctx the parse tree
     */
    exitDateTimeTtype?: (ctx: DateTimeTtypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.trimFunction`.
     * @param ctx the parse tree
     */
    enterTrimFunction?: (ctx: TrimFunctionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.trimFunction`.
     * @param ctx the parse tree
     */
    exitTrimFunction?: (ctx: TrimFunctionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.substringFunction`.
     * @param ctx the parse tree
     */
    enterSubstringFunction?: (ctx: SubstringFunctionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.substringFunction`.
     * @param ctx the parse tree
     */
    exitSubstringFunction?: (ctx: SubstringFunctionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.functionCall`.
     * @param ctx the parse tree
     */
    enterFunctionCall?: (ctx: FunctionCallContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.functionCall`.
     * @param ctx the parse tree
     */
    exitFunctionCall?: (ctx: FunctionCallContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.udfExprList`.
     * @param ctx the parse tree
     */
    enterUdfExprList?: (ctx: UdfExprListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.udfExprList`.
     * @param ctx the parse tree
     */
    exitUdfExprList?: (ctx: UdfExprListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.udfExpr`.
     * @param ctx the parse tree
     */
    enterUdfExpr?: (ctx: UdfExprContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.udfExpr`.
     * @param ctx the parse tree
     */
    exitUdfExpr?: (ctx: UdfExprContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.userVariable`.
     * @param ctx the parse tree
     */
    enterUserVariable?: (ctx: UserVariableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.userVariable`.
     * @param ctx the parse tree
     */
    exitUserVariable?: (ctx: UserVariableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.inExpressionUserVariableAssignment`.
     * @param ctx the parse tree
     */
    enterInExpressionUserVariableAssignment?: (ctx: InExpressionUserVariableAssignmentContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.inExpressionUserVariableAssignment`.
     * @param ctx the parse tree
     */
    exitInExpressionUserVariableAssignment?: (ctx: InExpressionUserVariableAssignmentContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.rvalueSystemOrUserVariable`.
     * @param ctx the parse tree
     */
    enterRvalueSystemOrUserVariable?: (ctx: RvalueSystemOrUserVariableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.rvalueSystemOrUserVariable`.
     * @param ctx the parse tree
     */
    exitRvalueSystemOrUserVariable?: (ctx: RvalueSystemOrUserVariableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.lvalueVariable`.
     * @param ctx the parse tree
     */
    enterLvalueVariable?: (ctx: LvalueVariableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.lvalueVariable`.
     * @param ctx the parse tree
     */
    exitLvalueVariable?: (ctx: LvalueVariableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.rvalueSystemVariable`.
     * @param ctx the parse tree
     */
    enterRvalueSystemVariable?: (ctx: RvalueSystemVariableContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.rvalueSystemVariable`.
     * @param ctx the parse tree
     */
    exitRvalueSystemVariable?: (ctx: RvalueSystemVariableContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.whenExpression`.
     * @param ctx the parse tree
     */
    enterWhenExpression?: (ctx: WhenExpressionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.whenExpression`.
     * @param ctx the parse tree
     */
    exitWhenExpression?: (ctx: WhenExpressionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.thenExpression`.
     * @param ctx the parse tree
     */
    enterThenExpression?: (ctx: ThenExpressionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.thenExpression`.
     * @param ctx the parse tree
     */
    exitThenExpression?: (ctx: ThenExpressionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.elseExpression`.
     * @param ctx the parse tree
     */
    enterElseExpression?: (ctx: ElseExpressionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.elseExpression`.
     * @param ctx the parse tree
     */
    exitElseExpression?: (ctx: ElseExpressionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.castType`.
     * @param ctx the parse tree
     */
    enterCastType?: (ctx: CastTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.castType`.
     * @param ctx the parse tree
     */
    exitCastType?: (ctx: CastTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.exprList`.
     * @param ctx the parse tree
     */
    enterExprList?: (ctx: ExprListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.exprList`.
     * @param ctx the parse tree
     */
    exitExprList?: (ctx: ExprListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.charset`.
     * @param ctx the parse tree
     */
    enterCharset?: (ctx: CharsetContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.charset`.
     * @param ctx the parse tree
     */
    exitCharset?: (ctx: CharsetContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.notRule`.
     * @param ctx the parse tree
     */
    enterNotRule?: (ctx: NotRuleContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.notRule`.
     * @param ctx the parse tree
     */
    exitNotRule?: (ctx: NotRuleContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.not2Rule`.
     * @param ctx the parse tree
     */
    enterNot2Rule?: (ctx: Not2RuleContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.not2Rule`.
     * @param ctx the parse tree
     */
    exitNot2Rule?: (ctx: Not2RuleContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.interval`.
     * @param ctx the parse tree
     */
    enterInterval?: (ctx: IntervalContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.interval`.
     * @param ctx the parse tree
     */
    exitInterval?: (ctx: IntervalContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.intervalTimeStamp`.
     * @param ctx the parse tree
     */
    enterIntervalTimeStamp?: (ctx: IntervalTimeStampContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.intervalTimeStamp`.
     * @param ctx the parse tree
     */
    exitIntervalTimeStamp?: (ctx: IntervalTimeStampContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.exprListWithParentheses`.
     * @param ctx the parse tree
     */
    enterExprListWithParentheses?: (ctx: ExprListWithParenthesesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.exprListWithParentheses`.
     * @param ctx the parse tree
     */
    exitExprListWithParentheses?: (ctx: ExprListWithParenthesesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.exprWithParentheses`.
     * @param ctx the parse tree
     */
    enterExprWithParentheses?: (ctx: ExprWithParenthesesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.exprWithParentheses`.
     * @param ctx the parse tree
     */
    exitExprWithParentheses?: (ctx: ExprWithParenthesesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.simpleExprWithParentheses`.
     * @param ctx the parse tree
     */
    enterSimpleExprWithParentheses?: (ctx: SimpleExprWithParenthesesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.simpleExprWithParentheses`.
     * @param ctx the parse tree
     */
    exitSimpleExprWithParentheses?: (ctx: SimpleExprWithParenthesesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.orderList`.
     * @param ctx the parse tree
     */
    enterOrderList?: (ctx: OrderListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.orderList`.
     * @param ctx the parse tree
     */
    exitOrderList?: (ctx: OrderListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.orderExpression`.
     * @param ctx the parse tree
     */
    enterOrderExpression?: (ctx: OrderExpressionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.orderExpression`.
     * @param ctx the parse tree
     */
    exitOrderExpression?: (ctx: OrderExpressionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.groupList`.
     * @param ctx the parse tree
     */
    enterGroupList?: (ctx: GroupListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.groupList`.
     * @param ctx the parse tree
     */
    exitGroupList?: (ctx: GroupListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.groupingExpression`.
     * @param ctx the parse tree
     */
    enterGroupingExpression?: (ctx: GroupingExpressionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.groupingExpression`.
     * @param ctx the parse tree
     */
    exitGroupingExpression?: (ctx: GroupingExpressionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.channel`.
     * @param ctx the parse tree
     */
    enterChannel?: (ctx: ChannelContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.channel`.
     * @param ctx the parse tree
     */
    exitChannel?: (ctx: ChannelContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.compoundStatement`.
     * @param ctx the parse tree
     */
    enterCompoundStatement?: (ctx: CompoundStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.compoundStatement`.
     * @param ctx the parse tree
     */
    exitCompoundStatement?: (ctx: CompoundStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.returnStatement`.
     * @param ctx the parse tree
     */
    enterReturnStatement?: (ctx: ReturnStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.returnStatement`.
     * @param ctx the parse tree
     */
    exitReturnStatement?: (ctx: ReturnStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.ifStatement`.
     * @param ctx the parse tree
     */
    enterIfStatement?: (ctx: IfStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.ifStatement`.
     * @param ctx the parse tree
     */
    exitIfStatement?: (ctx: IfStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.ifBody`.
     * @param ctx the parse tree
     */
    enterIfBody?: (ctx: IfBodyContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.ifBody`.
     * @param ctx the parse tree
     */
    exitIfBody?: (ctx: IfBodyContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.thenStatement`.
     * @param ctx the parse tree
     */
    enterThenStatement?: (ctx: ThenStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.thenStatement`.
     * @param ctx the parse tree
     */
    exitThenStatement?: (ctx: ThenStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.compoundStatementList`.
     * @param ctx the parse tree
     */
    enterCompoundStatementList?: (ctx: CompoundStatementListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.compoundStatementList`.
     * @param ctx the parse tree
     */
    exitCompoundStatementList?: (ctx: CompoundStatementListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.caseStatement`.
     * @param ctx the parse tree
     */
    enterCaseStatement?: (ctx: CaseStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.caseStatement`.
     * @param ctx the parse tree
     */
    exitCaseStatement?: (ctx: CaseStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.elseStatement`.
     * @param ctx the parse tree
     */
    enterElseStatement?: (ctx: ElseStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.elseStatement`.
     * @param ctx the parse tree
     */
    exitElseStatement?: (ctx: ElseStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.labeledBlock`.
     * @param ctx the parse tree
     */
    enterLabeledBlock?: (ctx: LabeledBlockContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.labeledBlock`.
     * @param ctx the parse tree
     */
    exitLabeledBlock?: (ctx: LabeledBlockContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.unlabeledBlock`.
     * @param ctx the parse tree
     */
    enterUnlabeledBlock?: (ctx: UnlabeledBlockContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.unlabeledBlock`.
     * @param ctx the parse tree
     */
    exitUnlabeledBlock?: (ctx: UnlabeledBlockContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.label`.
     * @param ctx the parse tree
     */
    enterLabel?: (ctx: LabelContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.label`.
     * @param ctx the parse tree
     */
    exitLabel?: (ctx: LabelContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.beginEndBlock`.
     * @param ctx the parse tree
     */
    enterBeginEndBlock?: (ctx: BeginEndBlockContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.beginEndBlock`.
     * @param ctx the parse tree
     */
    exitBeginEndBlock?: (ctx: BeginEndBlockContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.labeledControl`.
     * @param ctx the parse tree
     */
    enterLabeledControl?: (ctx: LabeledControlContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.labeledControl`.
     * @param ctx the parse tree
     */
    exitLabeledControl?: (ctx: LabeledControlContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.unlabeledControl`.
     * @param ctx the parse tree
     */
    enterUnlabeledControl?: (ctx: UnlabeledControlContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.unlabeledControl`.
     * @param ctx the parse tree
     */
    exitUnlabeledControl?: (ctx: UnlabeledControlContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.loopBlock`.
     * @param ctx the parse tree
     */
    enterLoopBlock?: (ctx: LoopBlockContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.loopBlock`.
     * @param ctx the parse tree
     */
    exitLoopBlock?: (ctx: LoopBlockContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.whileDoBlock`.
     * @param ctx the parse tree
     */
    enterWhileDoBlock?: (ctx: WhileDoBlockContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.whileDoBlock`.
     * @param ctx the parse tree
     */
    exitWhileDoBlock?: (ctx: WhileDoBlockContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.repeatUntilBlock`.
     * @param ctx the parse tree
     */
    enterRepeatUntilBlock?: (ctx: RepeatUntilBlockContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.repeatUntilBlock`.
     * @param ctx the parse tree
     */
    exitRepeatUntilBlock?: (ctx: RepeatUntilBlockContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.spDeclarations`.
     * @param ctx the parse tree
     */
    enterSpDeclarations?: (ctx: SpDeclarationsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.spDeclarations`.
     * @param ctx the parse tree
     */
    exitSpDeclarations?: (ctx: SpDeclarationsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.spDeclaration`.
     * @param ctx the parse tree
     */
    enterSpDeclaration?: (ctx: SpDeclarationContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.spDeclaration`.
     * @param ctx the parse tree
     */
    exitSpDeclaration?: (ctx: SpDeclarationContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.variableDeclaration`.
     * @param ctx the parse tree
     */
    enterVariableDeclaration?: (ctx: VariableDeclarationContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.variableDeclaration`.
     * @param ctx the parse tree
     */
    exitVariableDeclaration?: (ctx: VariableDeclarationContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.conditionDeclaration`.
     * @param ctx the parse tree
     */
    enterConditionDeclaration?: (ctx: ConditionDeclarationContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.conditionDeclaration`.
     * @param ctx the parse tree
     */
    exitConditionDeclaration?: (ctx: ConditionDeclarationContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.spCondition`.
     * @param ctx the parse tree
     */
    enterSpCondition?: (ctx: SpConditionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.spCondition`.
     * @param ctx the parse tree
     */
    exitSpCondition?: (ctx: SpConditionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.sqlstate`.
     * @param ctx the parse tree
     */
    enterSqlstate?: (ctx: SqlstateContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.sqlstate`.
     * @param ctx the parse tree
     */
    exitSqlstate?: (ctx: SqlstateContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.handlerDeclaration`.
     * @param ctx the parse tree
     */
    enterHandlerDeclaration?: (ctx: HandlerDeclarationContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.handlerDeclaration`.
     * @param ctx the parse tree
     */
    exitHandlerDeclaration?: (ctx: HandlerDeclarationContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.handlerCondition`.
     * @param ctx the parse tree
     */
    enterHandlerCondition?: (ctx: HandlerConditionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.handlerCondition`.
     * @param ctx the parse tree
     */
    exitHandlerCondition?: (ctx: HandlerConditionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.cursorDeclaration`.
     * @param ctx the parse tree
     */
    enterCursorDeclaration?: (ctx: CursorDeclarationContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.cursorDeclaration`.
     * @param ctx the parse tree
     */
    exitCursorDeclaration?: (ctx: CursorDeclarationContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.iterateStatement`.
     * @param ctx the parse tree
     */
    enterIterateStatement?: (ctx: IterateStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.iterateStatement`.
     * @param ctx the parse tree
     */
    exitIterateStatement?: (ctx: IterateStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.leaveStatement`.
     * @param ctx the parse tree
     */
    enterLeaveStatement?: (ctx: LeaveStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.leaveStatement`.
     * @param ctx the parse tree
     */
    exitLeaveStatement?: (ctx: LeaveStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.getDiagnosticsStatement`.
     * @param ctx the parse tree
     */
    enterGetDiagnosticsStatement?: (ctx: GetDiagnosticsStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.getDiagnosticsStatement`.
     * @param ctx the parse tree
     */
    exitGetDiagnosticsStatement?: (ctx: GetDiagnosticsStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.signalAllowedExpr`.
     * @param ctx the parse tree
     */
    enterSignalAllowedExpr?: (ctx: SignalAllowedExprContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.signalAllowedExpr`.
     * @param ctx the parse tree
     */
    exitSignalAllowedExpr?: (ctx: SignalAllowedExprContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.statementInformationItem`.
     * @param ctx the parse tree
     */
    enterStatementInformationItem?: (ctx: StatementInformationItemContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.statementInformationItem`.
     * @param ctx the parse tree
     */
    exitStatementInformationItem?: (ctx: StatementInformationItemContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.conditionInformationItem`.
     * @param ctx the parse tree
     */
    enterConditionInformationItem?: (ctx: ConditionInformationItemContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.conditionInformationItem`.
     * @param ctx the parse tree
     */
    exitConditionInformationItem?: (ctx: ConditionInformationItemContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.signalInformationItemName`.
     * @param ctx the parse tree
     */
    enterSignalInformationItemName?: (ctx: SignalInformationItemNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.signalInformationItemName`.
     * @param ctx the parse tree
     */
    exitSignalInformationItemName?: (ctx: SignalInformationItemNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.signalStatement`.
     * @param ctx the parse tree
     */
    enterSignalStatement?: (ctx: SignalStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.signalStatement`.
     * @param ctx the parse tree
     */
    exitSignalStatement?: (ctx: SignalStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.resignalStatement`.
     * @param ctx the parse tree
     */
    enterResignalStatement?: (ctx: ResignalStatementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.resignalStatement`.
     * @param ctx the parse tree
     */
    exitResignalStatement?: (ctx: ResignalStatementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.signalInformationItem`.
     * @param ctx the parse tree
     */
    enterSignalInformationItem?: (ctx: SignalInformationItemContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.signalInformationItem`.
     * @param ctx the parse tree
     */
    exitSignalInformationItem?: (ctx: SignalInformationItemContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.cursorOpen`.
     * @param ctx the parse tree
     */
    enterCursorOpen?: (ctx: CursorOpenContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.cursorOpen`.
     * @param ctx the parse tree
     */
    exitCursorOpen?: (ctx: CursorOpenContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.cursorClose`.
     * @param ctx the parse tree
     */
    enterCursorClose?: (ctx: CursorCloseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.cursorClose`.
     * @param ctx the parse tree
     */
    exitCursorClose?: (ctx: CursorCloseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.cursorFetch`.
     * @param ctx the parse tree
     */
    enterCursorFetch?: (ctx: CursorFetchContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.cursorFetch`.
     * @param ctx the parse tree
     */
    exitCursorFetch?: (ctx: CursorFetchContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.schedule`.
     * @param ctx the parse tree
     */
    enterSchedule?: (ctx: ScheduleContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.schedule`.
     * @param ctx the parse tree
     */
    exitSchedule?: (ctx: ScheduleContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.columnDefinition`.
     * @param ctx the parse tree
     */
    enterColumnDefinition?: (ctx: ColumnDefinitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.columnDefinition`.
     * @param ctx the parse tree
     */
    exitColumnDefinition?: (ctx: ColumnDefinitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.checkOrReferences`.
     * @param ctx the parse tree
     */
    enterCheckOrReferences?: (ctx: CheckOrReferencesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.checkOrReferences`.
     * @param ctx the parse tree
     */
    exitCheckOrReferences?: (ctx: CheckOrReferencesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.checkConstraint`.
     * @param ctx the parse tree
     */
    enterCheckConstraint?: (ctx: CheckConstraintContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.checkConstraint`.
     * @param ctx the parse tree
     */
    exitCheckConstraint?: (ctx: CheckConstraintContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.constraintEnforcement`.
     * @param ctx the parse tree
     */
    enterConstraintEnforcement?: (ctx: ConstraintEnforcementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.constraintEnforcement`.
     * @param ctx the parse tree
     */
    exitConstraintEnforcement?: (ctx: ConstraintEnforcementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableConstraintDef`.
     * @param ctx the parse tree
     */
    enterTableConstraintDef?: (ctx: TableConstraintDefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableConstraintDef`.
     * @param ctx the parse tree
     */
    exitTableConstraintDef?: (ctx: TableConstraintDefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.constraintName`.
     * @param ctx the parse tree
     */
    enterConstraintName?: (ctx: ConstraintNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.constraintName`.
     * @param ctx the parse tree
     */
    exitConstraintName?: (ctx: ConstraintNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.fieldDefinition`.
     * @param ctx the parse tree
     */
    enterFieldDefinition?: (ctx: FieldDefinitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.fieldDefinition`.
     * @param ctx the parse tree
     */
    exitFieldDefinition?: (ctx: FieldDefinitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.columnAttribute`.
     * @param ctx the parse tree
     */
    enterColumnAttribute?: (ctx: ColumnAttributeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.columnAttribute`.
     * @param ctx the parse tree
     */
    exitColumnAttribute?: (ctx: ColumnAttributeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.columnFormat`.
     * @param ctx the parse tree
     */
    enterColumnFormat?: (ctx: ColumnFormatContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.columnFormat`.
     * @param ctx the parse tree
     */
    exitColumnFormat?: (ctx: ColumnFormatContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.storageMedia`.
     * @param ctx the parse tree
     */
    enterStorageMedia?: (ctx: StorageMediaContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.storageMedia`.
     * @param ctx the parse tree
     */
    exitStorageMedia?: (ctx: StorageMediaContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.now`.
     * @param ctx the parse tree
     */
    enterNow?: (ctx: NowContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.now`.
     * @param ctx the parse tree
     */
    exitNow?: (ctx: NowContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.nowOrSignedLiteral`.
     * @param ctx the parse tree
     */
    enterNowOrSignedLiteral?: (ctx: NowOrSignedLiteralContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.nowOrSignedLiteral`.
     * @param ctx the parse tree
     */
    exitNowOrSignedLiteral?: (ctx: NowOrSignedLiteralContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.gcolAttribute`.
     * @param ctx the parse tree
     */
    enterGcolAttribute?: (ctx: GcolAttributeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.gcolAttribute`.
     * @param ctx the parse tree
     */
    exitGcolAttribute?: (ctx: GcolAttributeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.references`.
     * @param ctx the parse tree
     */
    enterReferences?: (ctx: ReferencesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.references`.
     * @param ctx the parse tree
     */
    exitReferences?: (ctx: ReferencesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.deleteOption`.
     * @param ctx the parse tree
     */
    enterDeleteOption?: (ctx: DeleteOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.deleteOption`.
     * @param ctx the parse tree
     */
    exitDeleteOption?: (ctx: DeleteOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.keyList`.
     * @param ctx the parse tree
     */
    enterKeyList?: (ctx: KeyListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.keyList`.
     * @param ctx the parse tree
     */
    exitKeyList?: (ctx: KeyListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.keyPart`.
     * @param ctx the parse tree
     */
    enterKeyPart?: (ctx: KeyPartContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.keyPart`.
     * @param ctx the parse tree
     */
    exitKeyPart?: (ctx: KeyPartContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.keyListWithExpression`.
     * @param ctx the parse tree
     */
    enterKeyListWithExpression?: (ctx: KeyListWithExpressionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.keyListWithExpression`.
     * @param ctx the parse tree
     */
    exitKeyListWithExpression?: (ctx: KeyListWithExpressionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.keyPartOrExpression`.
     * @param ctx the parse tree
     */
    enterKeyPartOrExpression?: (ctx: KeyPartOrExpressionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.keyPartOrExpression`.
     * @param ctx the parse tree
     */
    exitKeyPartOrExpression?: (ctx: KeyPartOrExpressionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.indexType`.
     * @param ctx the parse tree
     */
    enterIndexType?: (ctx: IndexTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.indexType`.
     * @param ctx the parse tree
     */
    exitIndexType?: (ctx: IndexTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.indexOption`.
     * @param ctx the parse tree
     */
    enterIndexOption?: (ctx: IndexOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.indexOption`.
     * @param ctx the parse tree
     */
    exitIndexOption?: (ctx: IndexOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.commonIndexOption`.
     * @param ctx the parse tree
     */
    enterCommonIndexOption?: (ctx: CommonIndexOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.commonIndexOption`.
     * @param ctx the parse tree
     */
    exitCommonIndexOption?: (ctx: CommonIndexOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.visibility`.
     * @param ctx the parse tree
     */
    enterVisibility?: (ctx: VisibilityContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.visibility`.
     * @param ctx the parse tree
     */
    exitVisibility?: (ctx: VisibilityContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.indexTypeClause`.
     * @param ctx the parse tree
     */
    enterIndexTypeClause?: (ctx: IndexTypeClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.indexTypeClause`.
     * @param ctx the parse tree
     */
    exitIndexTypeClause?: (ctx: IndexTypeClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.fulltextIndexOption`.
     * @param ctx the parse tree
     */
    enterFulltextIndexOption?: (ctx: FulltextIndexOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.fulltextIndexOption`.
     * @param ctx the parse tree
     */
    exitFulltextIndexOption?: (ctx: FulltextIndexOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.spatialIndexOption`.
     * @param ctx the parse tree
     */
    enterSpatialIndexOption?: (ctx: SpatialIndexOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.spatialIndexOption`.
     * @param ctx the parse tree
     */
    exitSpatialIndexOption?: (ctx: SpatialIndexOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dataTypeDefinition`.
     * @param ctx the parse tree
     */
    enterDataTypeDefinition?: (ctx: DataTypeDefinitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dataTypeDefinition`.
     * @param ctx the parse tree
     */
    exitDataTypeDefinition?: (ctx: DataTypeDefinitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dataType`.
     * @param ctx the parse tree
     */
    enterDataType?: (ctx: DataTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dataType`.
     * @param ctx the parse tree
     */
    exitDataType?: (ctx: DataTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.nchar`.
     * @param ctx the parse tree
     */
    enterNchar?: (ctx: NcharContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.nchar`.
     * @param ctx the parse tree
     */
    exitNchar?: (ctx: NcharContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.realType`.
     * @param ctx the parse tree
     */
    enterRealType?: (ctx: RealTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.realType`.
     * @param ctx the parse tree
     */
    exitRealType?: (ctx: RealTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.fieldLength`.
     * @param ctx the parse tree
     */
    enterFieldLength?: (ctx: FieldLengthContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.fieldLength`.
     * @param ctx the parse tree
     */
    exitFieldLength?: (ctx: FieldLengthContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.fieldOptions`.
     * @param ctx the parse tree
     */
    enterFieldOptions?: (ctx: FieldOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.fieldOptions`.
     * @param ctx the parse tree
     */
    exitFieldOptions?: (ctx: FieldOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.charsetWithOptBinary`.
     * @param ctx the parse tree
     */
    enterCharsetWithOptBinary?: (ctx: CharsetWithOptBinaryContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.charsetWithOptBinary`.
     * @param ctx the parse tree
     */
    exitCharsetWithOptBinary?: (ctx: CharsetWithOptBinaryContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.ascii`.
     * @param ctx the parse tree
     */
    enterAscii?: (ctx: AsciiContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.ascii`.
     * @param ctx the parse tree
     */
    exitAscii?: (ctx: AsciiContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.unicode`.
     * @param ctx the parse tree
     */
    enterUnicode?: (ctx: UnicodeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.unicode`.
     * @param ctx the parse tree
     */
    exitUnicode?: (ctx: UnicodeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.wsNumCodepoints`.
     * @param ctx the parse tree
     */
    enterWsNumCodepoints?: (ctx: WsNumCodepointsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.wsNumCodepoints`.
     * @param ctx the parse tree
     */
    exitWsNumCodepoints?: (ctx: WsNumCodepointsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.typeDatetimePrecision`.
     * @param ctx the parse tree
     */
    enterTypeDatetimePrecision?: (ctx: TypeDatetimePrecisionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.typeDatetimePrecision`.
     * @param ctx the parse tree
     */
    exitTypeDatetimePrecision?: (ctx: TypeDatetimePrecisionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.functionDatetimePrecision`.
     * @param ctx the parse tree
     */
    enterFunctionDatetimePrecision?: (ctx: FunctionDatetimePrecisionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.functionDatetimePrecision`.
     * @param ctx the parse tree
     */
    exitFunctionDatetimePrecision?: (ctx: FunctionDatetimePrecisionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.charsetName`.
     * @param ctx the parse tree
     */
    enterCharsetName?: (ctx: CharsetNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.charsetName`.
     * @param ctx the parse tree
     */
    exitCharsetName?: (ctx: CharsetNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.collationName`.
     * @param ctx the parse tree
     */
    enterCollationName?: (ctx: CollationNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.collationName`.
     * @param ctx the parse tree
     */
    exitCollationName?: (ctx: CollationNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createTableOptions`.
     * @param ctx the parse tree
     */
    enterCreateTableOptions?: (ctx: CreateTableOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createTableOptions`.
     * @param ctx the parse tree
     */
    exitCreateTableOptions?: (ctx: CreateTableOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createTableOptionsEtc`.
     * @param ctx the parse tree
     */
    enterCreateTableOptionsEtc?: (ctx: CreateTableOptionsEtcContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createTableOptionsEtc`.
     * @param ctx the parse tree
     */
    exitCreateTableOptionsEtc?: (ctx: CreateTableOptionsEtcContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createPartitioningEtc`.
     * @param ctx the parse tree
     */
    enterCreatePartitioningEtc?: (ctx: CreatePartitioningEtcContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createPartitioningEtc`.
     * @param ctx the parse tree
     */
    exitCreatePartitioningEtc?: (ctx: CreatePartitioningEtcContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createTableOptionsSpaceSeparated`.
     * @param ctx the parse tree
     */
    enterCreateTableOptionsSpaceSeparated?: (ctx: CreateTableOptionsSpaceSeparatedContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createTableOptionsSpaceSeparated`.
     * @param ctx the parse tree
     */
    exitCreateTableOptionsSpaceSeparated?: (ctx: CreateTableOptionsSpaceSeparatedContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createTableOption`.
     * @param ctx the parse tree
     */
    enterCreateTableOption?: (ctx: CreateTableOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createTableOption`.
     * @param ctx the parse tree
     */
    exitCreateTableOption?: (ctx: CreateTableOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.ternaryOption`.
     * @param ctx the parse tree
     */
    enterTernaryOption?: (ctx: TernaryOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.ternaryOption`.
     * @param ctx the parse tree
     */
    exitTernaryOption?: (ctx: TernaryOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.defaultCollation`.
     * @param ctx the parse tree
     */
    enterDefaultCollation?: (ctx: DefaultCollationContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.defaultCollation`.
     * @param ctx the parse tree
     */
    exitDefaultCollation?: (ctx: DefaultCollationContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.defaultEncryption`.
     * @param ctx the parse tree
     */
    enterDefaultEncryption?: (ctx: DefaultEncryptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.defaultEncryption`.
     * @param ctx the parse tree
     */
    exitDefaultEncryption?: (ctx: DefaultEncryptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.defaultCharset`.
     * @param ctx the parse tree
     */
    enterDefaultCharset?: (ctx: DefaultCharsetContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.defaultCharset`.
     * @param ctx the parse tree
     */
    exitDefaultCharset?: (ctx: DefaultCharsetContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.partitionClause`.
     * @param ctx the parse tree
     */
    enterPartitionClause?: (ctx: PartitionClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.partitionClause`.
     * @param ctx the parse tree
     */
    exitPartitionClause?: (ctx: PartitionClauseContext) => void;
    /**
     * Enter a parse tree produced by the `partitionDefKey`
     * labeled alternative in `MySQLParser.partitionTypeDef`.
     * @param ctx the parse tree
     */
    enterPartitionDefKey?: (ctx: PartitionDefKeyContext) => void;
    /**
     * Exit a parse tree produced by the `partitionDefKey`
     * labeled alternative in `MySQLParser.partitionTypeDef`.
     * @param ctx the parse tree
     */
    exitPartitionDefKey?: (ctx: PartitionDefKeyContext) => void;
    /**
     * Enter a parse tree produced by the `partitionDefHash`
     * labeled alternative in `MySQLParser.partitionTypeDef`.
     * @param ctx the parse tree
     */
    enterPartitionDefHash?: (ctx: PartitionDefHashContext) => void;
    /**
     * Exit a parse tree produced by the `partitionDefHash`
     * labeled alternative in `MySQLParser.partitionTypeDef`.
     * @param ctx the parse tree
     */
    exitPartitionDefHash?: (ctx: PartitionDefHashContext) => void;
    /**
     * Enter a parse tree produced by the `partitionDefRangeList`
     * labeled alternative in `MySQLParser.partitionTypeDef`.
     * @param ctx the parse tree
     */
    enterPartitionDefRangeList?: (ctx: PartitionDefRangeListContext) => void;
    /**
     * Exit a parse tree produced by the `partitionDefRangeList`
     * labeled alternative in `MySQLParser.partitionTypeDef`.
     * @param ctx the parse tree
     */
    exitPartitionDefRangeList?: (ctx: PartitionDefRangeListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.subPartitions`.
     * @param ctx the parse tree
     */
    enterSubPartitions?: (ctx: SubPartitionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.subPartitions`.
     * @param ctx the parse tree
     */
    exitSubPartitions?: (ctx: SubPartitionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.partitionKeyAlgorithm`.
     * @param ctx the parse tree
     */
    enterPartitionKeyAlgorithm?: (ctx: PartitionKeyAlgorithmContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.partitionKeyAlgorithm`.
     * @param ctx the parse tree
     */
    exitPartitionKeyAlgorithm?: (ctx: PartitionKeyAlgorithmContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.partitionDefinitions`.
     * @param ctx the parse tree
     */
    enterPartitionDefinitions?: (ctx: PartitionDefinitionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.partitionDefinitions`.
     * @param ctx the parse tree
     */
    exitPartitionDefinitions?: (ctx: PartitionDefinitionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.partitionDefinition`.
     * @param ctx the parse tree
     */
    enterPartitionDefinition?: (ctx: PartitionDefinitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.partitionDefinition`.
     * @param ctx the parse tree
     */
    exitPartitionDefinition?: (ctx: PartitionDefinitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.partitionValuesIn`.
     * @param ctx the parse tree
     */
    enterPartitionValuesIn?: (ctx: PartitionValuesInContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.partitionValuesIn`.
     * @param ctx the parse tree
     */
    exitPartitionValuesIn?: (ctx: PartitionValuesInContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.partitionOption`.
     * @param ctx the parse tree
     */
    enterPartitionOption?: (ctx: PartitionOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.partitionOption`.
     * @param ctx the parse tree
     */
    exitPartitionOption?: (ctx: PartitionOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.subpartitionDefinition`.
     * @param ctx the parse tree
     */
    enterSubpartitionDefinition?: (ctx: SubpartitionDefinitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.subpartitionDefinition`.
     * @param ctx the parse tree
     */
    exitSubpartitionDefinition?: (ctx: SubpartitionDefinitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.partitionValueItemListParen`.
     * @param ctx the parse tree
     */
    enterPartitionValueItemListParen?: (ctx: PartitionValueItemListParenContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.partitionValueItemListParen`.
     * @param ctx the parse tree
     */
    exitPartitionValueItemListParen?: (ctx: PartitionValueItemListParenContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.partitionValueItem`.
     * @param ctx the parse tree
     */
    enterPartitionValueItem?: (ctx: PartitionValueItemContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.partitionValueItem`.
     * @param ctx the parse tree
     */
    exitPartitionValueItem?: (ctx: PartitionValueItemContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.definerClause`.
     * @param ctx the parse tree
     */
    enterDefinerClause?: (ctx: DefinerClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.definerClause`.
     * @param ctx the parse tree
     */
    exitDefinerClause?: (ctx: DefinerClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.ifExists`.
     * @param ctx the parse tree
     */
    enterIfExists?: (ctx: IfExistsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.ifExists`.
     * @param ctx the parse tree
     */
    exitIfExists?: (ctx: IfExistsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.ifNotExists`.
     * @param ctx the parse tree
     */
    enterIfNotExists?: (ctx: IfNotExistsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.ifNotExists`.
     * @param ctx the parse tree
     */
    exitIfNotExists?: (ctx: IfNotExistsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.ignoreUnknownUser`.
     * @param ctx the parse tree
     */
    enterIgnoreUnknownUser?: (ctx: IgnoreUnknownUserContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.ignoreUnknownUser`.
     * @param ctx the parse tree
     */
    exitIgnoreUnknownUser?: (ctx: IgnoreUnknownUserContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.procedureParameter`.
     * @param ctx the parse tree
     */
    enterProcedureParameter?: (ctx: ProcedureParameterContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.procedureParameter`.
     * @param ctx the parse tree
     */
    exitProcedureParameter?: (ctx: ProcedureParameterContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.functionParameter`.
     * @param ctx the parse tree
     */
    enterFunctionParameter?: (ctx: FunctionParameterContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.functionParameter`.
     * @param ctx the parse tree
     */
    exitFunctionParameter?: (ctx: FunctionParameterContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.collate`.
     * @param ctx the parse tree
     */
    enterCollate?: (ctx: CollateContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.collate`.
     * @param ctx the parse tree
     */
    exitCollate?: (ctx: CollateContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.typeWithOptCollate`.
     * @param ctx the parse tree
     */
    enterTypeWithOptCollate?: (ctx: TypeWithOptCollateContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.typeWithOptCollate`.
     * @param ctx the parse tree
     */
    exitTypeWithOptCollate?: (ctx: TypeWithOptCollateContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.schemaIdentifierPair`.
     * @param ctx the parse tree
     */
    enterSchemaIdentifierPair?: (ctx: SchemaIdentifierPairContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.schemaIdentifierPair`.
     * @param ctx the parse tree
     */
    exitSchemaIdentifierPair?: (ctx: SchemaIdentifierPairContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.viewRefList`.
     * @param ctx the parse tree
     */
    enterViewRefList?: (ctx: ViewRefListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.viewRefList`.
     * @param ctx the parse tree
     */
    exitViewRefList?: (ctx: ViewRefListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.updateList`.
     * @param ctx the parse tree
     */
    enterUpdateList?: (ctx: UpdateListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.updateList`.
     * @param ctx the parse tree
     */
    exitUpdateList?: (ctx: UpdateListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.updateElement`.
     * @param ctx the parse tree
     */
    enterUpdateElement?: (ctx: UpdateElementContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.updateElement`.
     * @param ctx the parse tree
     */
    exitUpdateElement?: (ctx: UpdateElementContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.charsetClause`.
     * @param ctx the parse tree
     */
    enterCharsetClause?: (ctx: CharsetClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.charsetClause`.
     * @param ctx the parse tree
     */
    exitCharsetClause?: (ctx: CharsetClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.fieldsClause`.
     * @param ctx the parse tree
     */
    enterFieldsClause?: (ctx: FieldsClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.fieldsClause`.
     * @param ctx the parse tree
     */
    exitFieldsClause?: (ctx: FieldsClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.fieldTerm`.
     * @param ctx the parse tree
     */
    enterFieldTerm?: (ctx: FieldTermContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.fieldTerm`.
     * @param ctx the parse tree
     */
    exitFieldTerm?: (ctx: FieldTermContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.linesClause`.
     * @param ctx the parse tree
     */
    enterLinesClause?: (ctx: LinesClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.linesClause`.
     * @param ctx the parse tree
     */
    exitLinesClause?: (ctx: LinesClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.lineTerm`.
     * @param ctx the parse tree
     */
    enterLineTerm?: (ctx: LineTermContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.lineTerm`.
     * @param ctx the parse tree
     */
    exitLineTerm?: (ctx: LineTermContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.userList`.
     * @param ctx the parse tree
     */
    enterUserList?: (ctx: UserListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.userList`.
     * @param ctx the parse tree
     */
    exitUserList?: (ctx: UserListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createUserList`.
     * @param ctx the parse tree
     */
    enterCreateUserList?: (ctx: CreateUserListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createUserList`.
     * @param ctx the parse tree
     */
    exitCreateUserList?: (ctx: CreateUserListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createUser`.
     * @param ctx the parse tree
     */
    enterCreateUser?: (ctx: CreateUserContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createUser`.
     * @param ctx the parse tree
     */
    exitCreateUser?: (ctx: CreateUserContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.createUserWithMfa`.
     * @param ctx the parse tree
     */
    enterCreateUserWithMfa?: (ctx: CreateUserWithMfaContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.createUserWithMfa`.
     * @param ctx the parse tree
     */
    exitCreateUserWithMfa?: (ctx: CreateUserWithMfaContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identification`.
     * @param ctx the parse tree
     */
    enterIdentification?: (ctx: IdentificationContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identification`.
     * @param ctx the parse tree
     */
    exitIdentification?: (ctx: IdentificationContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifiedByPassword`.
     * @param ctx the parse tree
     */
    enterIdentifiedByPassword?: (ctx: IdentifiedByPasswordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifiedByPassword`.
     * @param ctx the parse tree
     */
    exitIdentifiedByPassword?: (ctx: IdentifiedByPasswordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifiedByRandomPassword`.
     * @param ctx the parse tree
     */
    enterIdentifiedByRandomPassword?: (ctx: IdentifiedByRandomPasswordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifiedByRandomPassword`.
     * @param ctx the parse tree
     */
    exitIdentifiedByRandomPassword?: (ctx: IdentifiedByRandomPasswordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifiedWithPlugin`.
     * @param ctx the parse tree
     */
    enterIdentifiedWithPlugin?: (ctx: IdentifiedWithPluginContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifiedWithPlugin`.
     * @param ctx the parse tree
     */
    exitIdentifiedWithPlugin?: (ctx: IdentifiedWithPluginContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifiedWithPluginAsAuth`.
     * @param ctx the parse tree
     */
    enterIdentifiedWithPluginAsAuth?: (ctx: IdentifiedWithPluginAsAuthContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifiedWithPluginAsAuth`.
     * @param ctx the parse tree
     */
    exitIdentifiedWithPluginAsAuth?: (ctx: IdentifiedWithPluginAsAuthContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifiedWithPluginByPassword`.
     * @param ctx the parse tree
     */
    enterIdentifiedWithPluginByPassword?: (ctx: IdentifiedWithPluginByPasswordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifiedWithPluginByPassword`.
     * @param ctx the parse tree
     */
    exitIdentifiedWithPluginByPassword?: (ctx: IdentifiedWithPluginByPasswordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifiedWithPluginByRandomPassword`.
     * @param ctx the parse tree
     */
    enterIdentifiedWithPluginByRandomPassword?: (ctx: IdentifiedWithPluginByRandomPasswordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifiedWithPluginByRandomPassword`.
     * @param ctx the parse tree
     */
    exitIdentifiedWithPluginByRandomPassword?: (ctx: IdentifiedWithPluginByRandomPasswordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.initialAuth`.
     * @param ctx the parse tree
     */
    enterInitialAuth?: (ctx: InitialAuthContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.initialAuth`.
     * @param ctx the parse tree
     */
    exitInitialAuth?: (ctx: InitialAuthContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.retainCurrentPassword`.
     * @param ctx the parse tree
     */
    enterRetainCurrentPassword?: (ctx: RetainCurrentPasswordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.retainCurrentPassword`.
     * @param ctx the parse tree
     */
    exitRetainCurrentPassword?: (ctx: RetainCurrentPasswordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.discardOldPassword`.
     * @param ctx the parse tree
     */
    enterDiscardOldPassword?: (ctx: DiscardOldPasswordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.discardOldPassword`.
     * @param ctx the parse tree
     */
    exitDiscardOldPassword?: (ctx: DiscardOldPasswordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.userRegistration`.
     * @param ctx the parse tree
     */
    enterUserRegistration?: (ctx: UserRegistrationContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.userRegistration`.
     * @param ctx the parse tree
     */
    exitUserRegistration?: (ctx: UserRegistrationContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.factor`.
     * @param ctx the parse tree
     */
    enterFactor?: (ctx: FactorContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.factor`.
     * @param ctx the parse tree
     */
    exitFactor?: (ctx: FactorContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.replacePassword`.
     * @param ctx the parse tree
     */
    enterReplacePassword?: (ctx: ReplacePasswordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.replacePassword`.
     * @param ctx the parse tree
     */
    exitReplacePassword?: (ctx: ReplacePasswordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.userIdentifierOrText`.
     * @param ctx the parse tree
     */
    enterUserIdentifierOrText?: (ctx: UserIdentifierOrTextContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.userIdentifierOrText`.
     * @param ctx the parse tree
     */
    exitUserIdentifierOrText?: (ctx: UserIdentifierOrTextContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.user`.
     * @param ctx the parse tree
     */
    enterUser?: (ctx: UserContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.user`.
     * @param ctx the parse tree
     */
    exitUser?: (ctx: UserContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.likeClause`.
     * @param ctx the parse tree
     */
    enterLikeClause?: (ctx: LikeClauseContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.likeClause`.
     * @param ctx the parse tree
     */
    exitLikeClause?: (ctx: LikeClauseContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.likeOrWhere`.
     * @param ctx the parse tree
     */
    enterLikeOrWhere?: (ctx: LikeOrWhereContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.likeOrWhere`.
     * @param ctx the parse tree
     */
    exitLikeOrWhere?: (ctx: LikeOrWhereContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.onlineOption`.
     * @param ctx the parse tree
     */
    enterOnlineOption?: (ctx: OnlineOptionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.onlineOption`.
     * @param ctx the parse tree
     */
    exitOnlineOption?: (ctx: OnlineOptionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.noWriteToBinLog`.
     * @param ctx the parse tree
     */
    enterNoWriteToBinLog?: (ctx: NoWriteToBinLogContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.noWriteToBinLog`.
     * @param ctx the parse tree
     */
    exitNoWriteToBinLog?: (ctx: NoWriteToBinLogContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.usePartition`.
     * @param ctx the parse tree
     */
    enterUsePartition?: (ctx: UsePartitionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.usePartition`.
     * @param ctx the parse tree
     */
    exitUsePartition?: (ctx: UsePartitionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.fieldIdentifier`.
     * @param ctx the parse tree
     */
    enterFieldIdentifier?: (ctx: FieldIdentifierContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.fieldIdentifier`.
     * @param ctx the parse tree
     */
    exitFieldIdentifier?: (ctx: FieldIdentifierContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.columnName`.
     * @param ctx the parse tree
     */
    enterColumnName?: (ctx: ColumnNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.columnName`.
     * @param ctx the parse tree
     */
    exitColumnName?: (ctx: ColumnNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.columnInternalRef`.
     * @param ctx the parse tree
     */
    enterColumnInternalRef?: (ctx: ColumnInternalRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.columnInternalRef`.
     * @param ctx the parse tree
     */
    exitColumnInternalRef?: (ctx: ColumnInternalRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.columnInternalRefList`.
     * @param ctx the parse tree
     */
    enterColumnInternalRefList?: (ctx: ColumnInternalRefListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.columnInternalRefList`.
     * @param ctx the parse tree
     */
    exitColumnInternalRefList?: (ctx: ColumnInternalRefListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.columnRef`.
     * @param ctx the parse tree
     */
    enterColumnRef?: (ctx: ColumnRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.columnRef`.
     * @param ctx the parse tree
     */
    exitColumnRef?: (ctx: ColumnRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.insertIdentifier`.
     * @param ctx the parse tree
     */
    enterInsertIdentifier?: (ctx: InsertIdentifierContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.insertIdentifier`.
     * @param ctx the parse tree
     */
    exitInsertIdentifier?: (ctx: InsertIdentifierContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.indexName`.
     * @param ctx the parse tree
     */
    enterIndexName?: (ctx: IndexNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.indexName`.
     * @param ctx the parse tree
     */
    exitIndexName?: (ctx: IndexNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.indexRef`.
     * @param ctx the parse tree
     */
    enterIndexRef?: (ctx: IndexRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.indexRef`.
     * @param ctx the parse tree
     */
    exitIndexRef?: (ctx: IndexRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableWild`.
     * @param ctx the parse tree
     */
    enterTableWild?: (ctx: TableWildContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableWild`.
     * @param ctx the parse tree
     */
    exitTableWild?: (ctx: TableWildContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.schemaName`.
     * @param ctx the parse tree
     */
    enterSchemaName?: (ctx: SchemaNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.schemaName`.
     * @param ctx the parse tree
     */
    exitSchemaName?: (ctx: SchemaNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.schemaRef`.
     * @param ctx the parse tree
     */
    enterSchemaRef?: (ctx: SchemaRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.schemaRef`.
     * @param ctx the parse tree
     */
    exitSchemaRef?: (ctx: SchemaRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.procedureName`.
     * @param ctx the parse tree
     */
    enterProcedureName?: (ctx: ProcedureNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.procedureName`.
     * @param ctx the parse tree
     */
    exitProcedureName?: (ctx: ProcedureNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.procedureRef`.
     * @param ctx the parse tree
     */
    enterProcedureRef?: (ctx: ProcedureRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.procedureRef`.
     * @param ctx the parse tree
     */
    exitProcedureRef?: (ctx: ProcedureRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.functionName`.
     * @param ctx the parse tree
     */
    enterFunctionName?: (ctx: FunctionNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.functionName`.
     * @param ctx the parse tree
     */
    exitFunctionName?: (ctx: FunctionNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.functionRef`.
     * @param ctx the parse tree
     */
    enterFunctionRef?: (ctx: FunctionRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.functionRef`.
     * @param ctx the parse tree
     */
    exitFunctionRef?: (ctx: FunctionRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.triggerName`.
     * @param ctx the parse tree
     */
    enterTriggerName?: (ctx: TriggerNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.triggerName`.
     * @param ctx the parse tree
     */
    exitTriggerName?: (ctx: TriggerNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.triggerRef`.
     * @param ctx the parse tree
     */
    enterTriggerRef?: (ctx: TriggerRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.triggerRef`.
     * @param ctx the parse tree
     */
    exitTriggerRef?: (ctx: TriggerRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.viewName`.
     * @param ctx the parse tree
     */
    enterViewName?: (ctx: ViewNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.viewName`.
     * @param ctx the parse tree
     */
    exitViewName?: (ctx: ViewNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.viewRef`.
     * @param ctx the parse tree
     */
    enterViewRef?: (ctx: ViewRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.viewRef`.
     * @param ctx the parse tree
     */
    exitViewRef?: (ctx: ViewRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tablespaceName`.
     * @param ctx the parse tree
     */
    enterTablespaceName?: (ctx: TablespaceNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tablespaceName`.
     * @param ctx the parse tree
     */
    exitTablespaceName?: (ctx: TablespaceNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tablespaceRef`.
     * @param ctx the parse tree
     */
    enterTablespaceRef?: (ctx: TablespaceRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tablespaceRef`.
     * @param ctx the parse tree
     */
    exitTablespaceRef?: (ctx: TablespaceRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.logfileGroupName`.
     * @param ctx the parse tree
     */
    enterLogfileGroupName?: (ctx: LogfileGroupNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.logfileGroupName`.
     * @param ctx the parse tree
     */
    exitLogfileGroupName?: (ctx: LogfileGroupNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.logfileGroupRef`.
     * @param ctx the parse tree
     */
    enterLogfileGroupRef?: (ctx: LogfileGroupRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.logfileGroupRef`.
     * @param ctx the parse tree
     */
    exitLogfileGroupRef?: (ctx: LogfileGroupRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.eventName`.
     * @param ctx the parse tree
     */
    enterEventName?: (ctx: EventNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.eventName`.
     * @param ctx the parse tree
     */
    exitEventName?: (ctx: EventNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.eventRef`.
     * @param ctx the parse tree
     */
    enterEventRef?: (ctx: EventRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.eventRef`.
     * @param ctx the parse tree
     */
    exitEventRef?: (ctx: EventRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.udfName`.
     * @param ctx the parse tree
     */
    enterUdfName?: (ctx: UdfNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.udfName`.
     * @param ctx the parse tree
     */
    exitUdfName?: (ctx: UdfNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.serverName`.
     * @param ctx the parse tree
     */
    enterServerName?: (ctx: ServerNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.serverName`.
     * @param ctx the parse tree
     */
    exitServerName?: (ctx: ServerNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.serverRef`.
     * @param ctx the parse tree
     */
    enterServerRef?: (ctx: ServerRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.serverRef`.
     * @param ctx the parse tree
     */
    exitServerRef?: (ctx: ServerRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.engineRef`.
     * @param ctx the parse tree
     */
    enterEngineRef?: (ctx: EngineRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.engineRef`.
     * @param ctx the parse tree
     */
    exitEngineRef?: (ctx: EngineRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableName`.
     * @param ctx the parse tree
     */
    enterTableName?: (ctx: TableNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableName`.
     * @param ctx the parse tree
     */
    exitTableName?: (ctx: TableNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.filterTableRef`.
     * @param ctx the parse tree
     */
    enterFilterTableRef?: (ctx: FilterTableRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.filterTableRef`.
     * @param ctx the parse tree
     */
    exitFilterTableRef?: (ctx: FilterTableRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableRefWithWildcard`.
     * @param ctx the parse tree
     */
    enterTableRefWithWildcard?: (ctx: TableRefWithWildcardContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableRefWithWildcard`.
     * @param ctx the parse tree
     */
    exitTableRefWithWildcard?: (ctx: TableRefWithWildcardContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableRef`.
     * @param ctx the parse tree
     */
    enterTableRef?: (ctx: TableRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableRef`.
     * @param ctx the parse tree
     */
    exitTableRef?: (ctx: TableRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableRefList`.
     * @param ctx the parse tree
     */
    enterTableRefList?: (ctx: TableRefListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableRefList`.
     * @param ctx the parse tree
     */
    exitTableRefList?: (ctx: TableRefListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.tableAliasRefList`.
     * @param ctx the parse tree
     */
    enterTableAliasRefList?: (ctx: TableAliasRefListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.tableAliasRefList`.
     * @param ctx the parse tree
     */
    exitTableAliasRefList?: (ctx: TableAliasRefListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.parameterName`.
     * @param ctx the parse tree
     */
    enterParameterName?: (ctx: ParameterNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.parameterName`.
     * @param ctx the parse tree
     */
    exitParameterName?: (ctx: ParameterNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.labelIdentifier`.
     * @param ctx the parse tree
     */
    enterLabelIdentifier?: (ctx: LabelIdentifierContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.labelIdentifier`.
     * @param ctx the parse tree
     */
    exitLabelIdentifier?: (ctx: LabelIdentifierContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.labelRef`.
     * @param ctx the parse tree
     */
    enterLabelRef?: (ctx: LabelRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.labelRef`.
     * @param ctx the parse tree
     */
    exitLabelRef?: (ctx: LabelRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.roleIdentifier`.
     * @param ctx the parse tree
     */
    enterRoleIdentifier?: (ctx: RoleIdentifierContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.roleIdentifier`.
     * @param ctx the parse tree
     */
    exitRoleIdentifier?: (ctx: RoleIdentifierContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.pluginRef`.
     * @param ctx the parse tree
     */
    enterPluginRef?: (ctx: PluginRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.pluginRef`.
     * @param ctx the parse tree
     */
    exitPluginRef?: (ctx: PluginRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.componentRef`.
     * @param ctx the parse tree
     */
    enterComponentRef?: (ctx: ComponentRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.componentRef`.
     * @param ctx the parse tree
     */
    exitComponentRef?: (ctx: ComponentRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.resourceGroupRef`.
     * @param ctx the parse tree
     */
    enterResourceGroupRef?: (ctx: ResourceGroupRefContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.resourceGroupRef`.
     * @param ctx the parse tree
     */
    exitResourceGroupRef?: (ctx: ResourceGroupRefContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.windowName`.
     * @param ctx the parse tree
     */
    enterWindowName?: (ctx: WindowNameContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.windowName`.
     * @param ctx the parse tree
     */
    exitWindowName?: (ctx: WindowNameContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.pureIdentifier`.
     * @param ctx the parse tree
     */
    enterPureIdentifier?: (ctx: PureIdentifierContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.pureIdentifier`.
     * @param ctx the parse tree
     */
    exitPureIdentifier?: (ctx: PureIdentifierContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifier`.
     * @param ctx the parse tree
     */
    enterIdentifier?: (ctx: IdentifierContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifier`.
     * @param ctx the parse tree
     */
    exitIdentifier?: (ctx: IdentifierContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifierList`.
     * @param ctx the parse tree
     */
    enterIdentifierList?: (ctx: IdentifierListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifierList`.
     * @param ctx the parse tree
     */
    exitIdentifierList?: (ctx: IdentifierListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifierListWithParentheses`.
     * @param ctx the parse tree
     */
    enterIdentifierListWithParentheses?: (ctx: IdentifierListWithParenthesesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifierListWithParentheses`.
     * @param ctx the parse tree
     */
    exitIdentifierListWithParentheses?: (ctx: IdentifierListWithParenthesesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.qualifiedIdentifier`.
     * @param ctx the parse tree
     */
    enterQualifiedIdentifier?: (ctx: QualifiedIdentifierContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.qualifiedIdentifier`.
     * @param ctx the parse tree
     */
    exitQualifiedIdentifier?: (ctx: QualifiedIdentifierContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.simpleIdentifier`.
     * @param ctx the parse tree
     */
    enterSimpleIdentifier?: (ctx: SimpleIdentifierContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.simpleIdentifier`.
     * @param ctx the parse tree
     */
    exitSimpleIdentifier?: (ctx: SimpleIdentifierContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.dotIdentifier`.
     * @param ctx the parse tree
     */
    enterDotIdentifier?: (ctx: DotIdentifierContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.dotIdentifier`.
     * @param ctx the parse tree
     */
    exitDotIdentifier?: (ctx: DotIdentifierContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.ulong_number`.
     * @param ctx the parse tree
     */
    enterUlong_number?: (ctx: Ulong_numberContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.ulong_number`.
     * @param ctx the parse tree
     */
    exitUlong_number?: (ctx: Ulong_numberContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.real_ulong_number`.
     * @param ctx the parse tree
     */
    enterReal_ulong_number?: (ctx: Real_ulong_numberContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.real_ulong_number`.
     * @param ctx the parse tree
     */
    exitReal_ulong_number?: (ctx: Real_ulong_numberContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.ulonglong_number`.
     * @param ctx the parse tree
     */
    enterUlonglong_number?: (ctx: Ulonglong_numberContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.ulonglong_number`.
     * @param ctx the parse tree
     */
    exitUlonglong_number?: (ctx: Ulonglong_numberContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.real_ulonglong_number`.
     * @param ctx the parse tree
     */
    enterReal_ulonglong_number?: (ctx: Real_ulonglong_numberContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.real_ulonglong_number`.
     * @param ctx the parse tree
     */
    exitReal_ulonglong_number?: (ctx: Real_ulonglong_numberContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.signedLiteral`.
     * @param ctx the parse tree
     */
    enterSignedLiteral?: (ctx: SignedLiteralContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.signedLiteral`.
     * @param ctx the parse tree
     */
    exitSignedLiteral?: (ctx: SignedLiteralContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.signedLiteralOrNull`.
     * @param ctx the parse tree
     */
    enterSignedLiteralOrNull?: (ctx: SignedLiteralOrNullContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.signedLiteralOrNull`.
     * @param ctx the parse tree
     */
    exitSignedLiteralOrNull?: (ctx: SignedLiteralOrNullContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.literal`.
     * @param ctx the parse tree
     */
    enterLiteral?: (ctx: LiteralContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.literal`.
     * @param ctx the parse tree
     */
    exitLiteral?: (ctx: LiteralContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.literalOrNull`.
     * @param ctx the parse tree
     */
    enterLiteralOrNull?: (ctx: LiteralOrNullContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.literalOrNull`.
     * @param ctx the parse tree
     */
    exitLiteralOrNull?: (ctx: LiteralOrNullContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.nullAsLiteral`.
     * @param ctx the parse tree
     */
    enterNullAsLiteral?: (ctx: NullAsLiteralContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.nullAsLiteral`.
     * @param ctx the parse tree
     */
    exitNullAsLiteral?: (ctx: NullAsLiteralContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.stringList`.
     * @param ctx the parse tree
     */
    enterStringList?: (ctx: StringListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.stringList`.
     * @param ctx the parse tree
     */
    exitStringList?: (ctx: StringListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.textStringLiteral`.
     * @param ctx the parse tree
     */
    enterTextStringLiteral?: (ctx: TextStringLiteralContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.textStringLiteral`.
     * @param ctx the parse tree
     */
    exitTextStringLiteral?: (ctx: TextStringLiteralContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.textString`.
     * @param ctx the parse tree
     */
    enterTextString?: (ctx: TextStringContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.textString`.
     * @param ctx the parse tree
     */
    exitTextString?: (ctx: TextStringContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.textStringHash`.
     * @param ctx the parse tree
     */
    enterTextStringHash?: (ctx: TextStringHashContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.textStringHash`.
     * @param ctx the parse tree
     */
    exitTextStringHash?: (ctx: TextStringHashContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.textLiteral`.
     * @param ctx the parse tree
     */
    enterTextLiteral?: (ctx: TextLiteralContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.textLiteral`.
     * @param ctx the parse tree
     */
    exitTextLiteral?: (ctx: TextLiteralContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.textStringNoLinebreak`.
     * @param ctx the parse tree
     */
    enterTextStringNoLinebreak?: (ctx: TextStringNoLinebreakContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.textStringNoLinebreak`.
     * @param ctx the parse tree
     */
    exitTextStringNoLinebreak?: (ctx: TextStringNoLinebreakContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.textStringLiteralList`.
     * @param ctx the parse tree
     */
    enterTextStringLiteralList?: (ctx: TextStringLiteralListContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.textStringLiteralList`.
     * @param ctx the parse tree
     */
    exitTextStringLiteralList?: (ctx: TextStringLiteralListContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.numLiteral`.
     * @param ctx the parse tree
     */
    enterNumLiteral?: (ctx: NumLiteralContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.numLiteral`.
     * @param ctx the parse tree
     */
    exitNumLiteral?: (ctx: NumLiteralContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.boolLiteral`.
     * @param ctx the parse tree
     */
    enterBoolLiteral?: (ctx: BoolLiteralContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.boolLiteral`.
     * @param ctx the parse tree
     */
    exitBoolLiteral?: (ctx: BoolLiteralContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.nullLiteral`.
     * @param ctx the parse tree
     */
    enterNullLiteral?: (ctx: NullLiteralContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.nullLiteral`.
     * @param ctx the parse tree
     */
    exitNullLiteral?: (ctx: NullLiteralContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.int64Literal`.
     * @param ctx the parse tree
     */
    enterInt64Literal?: (ctx: Int64LiteralContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.int64Literal`.
     * @param ctx the parse tree
     */
    exitInt64Literal?: (ctx: Int64LiteralContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.temporalLiteral`.
     * @param ctx the parse tree
     */
    enterTemporalLiteral?: (ctx: TemporalLiteralContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.temporalLiteral`.
     * @param ctx the parse tree
     */
    exitTemporalLiteral?: (ctx: TemporalLiteralContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.floatOptions`.
     * @param ctx the parse tree
     */
    enterFloatOptions?: (ctx: FloatOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.floatOptions`.
     * @param ctx the parse tree
     */
    exitFloatOptions?: (ctx: FloatOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.standardFloatOptions`.
     * @param ctx the parse tree
     */
    enterStandardFloatOptions?: (ctx: StandardFloatOptionsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.standardFloatOptions`.
     * @param ctx the parse tree
     */
    exitStandardFloatOptions?: (ctx: StandardFloatOptionsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.precision`.
     * @param ctx the parse tree
     */
    enterPrecision?: (ctx: PrecisionContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.precision`.
     * @param ctx the parse tree
     */
    exitPrecision?: (ctx: PrecisionContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.textOrIdentifier`.
     * @param ctx the parse tree
     */
    enterTextOrIdentifier?: (ctx: TextOrIdentifierContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.textOrIdentifier`.
     * @param ctx the parse tree
     */
    exitTextOrIdentifier?: (ctx: TextOrIdentifierContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.lValueIdentifier`.
     * @param ctx the parse tree
     */
    enterLValueIdentifier?: (ctx: LValueIdentifierContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.lValueIdentifier`.
     * @param ctx the parse tree
     */
    exitLValueIdentifier?: (ctx: LValueIdentifierContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.roleIdentifierOrText`.
     * @param ctx the parse tree
     */
    enterRoleIdentifierOrText?: (ctx: RoleIdentifierOrTextContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.roleIdentifierOrText`.
     * @param ctx the parse tree
     */
    exitRoleIdentifierOrText?: (ctx: RoleIdentifierOrTextContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.sizeNumber`.
     * @param ctx the parse tree
     */
    enterSizeNumber?: (ctx: SizeNumberContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.sizeNumber`.
     * @param ctx the parse tree
     */
    exitSizeNumber?: (ctx: SizeNumberContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.parentheses`.
     * @param ctx the parse tree
     */
    enterParentheses?: (ctx: ParenthesesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.parentheses`.
     * @param ctx the parse tree
     */
    exitParentheses?: (ctx: ParenthesesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.equal`.
     * @param ctx the parse tree
     */
    enterEqual?: (ctx: EqualContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.equal`.
     * @param ctx the parse tree
     */
    exitEqual?: (ctx: EqualContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.optionType`.
     * @param ctx the parse tree
     */
    enterOptionType?: (ctx: OptionTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.optionType`.
     * @param ctx the parse tree
     */
    exitOptionType?: (ctx: OptionTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.rvalueSystemVariableType`.
     * @param ctx the parse tree
     */
    enterRvalueSystemVariableType?: (ctx: RvalueSystemVariableTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.rvalueSystemVariableType`.
     * @param ctx the parse tree
     */
    exitRvalueSystemVariableType?: (ctx: RvalueSystemVariableTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.setVarIdentType`.
     * @param ctx the parse tree
     */
    enterSetVarIdentType?: (ctx: SetVarIdentTypeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.setVarIdentType`.
     * @param ctx the parse tree
     */
    exitSetVarIdentType?: (ctx: SetVarIdentTypeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.jsonAttribute`.
     * @param ctx the parse tree
     */
    enterJsonAttribute?: (ctx: JsonAttributeContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.jsonAttribute`.
     * @param ctx the parse tree
     */
    exitJsonAttribute?: (ctx: JsonAttributeContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifierKeyword`.
     * @param ctx the parse tree
     */
    enterIdentifierKeyword?: (ctx: IdentifierKeywordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifierKeyword`.
     * @param ctx the parse tree
     */
    exitIdentifierKeyword?: (ctx: IdentifierKeywordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifierKeywordsAmbiguous1RolesAndLabels`.
     * @param ctx the parse tree
     */
    enterIdentifierKeywordsAmbiguous1RolesAndLabels?: (ctx: IdentifierKeywordsAmbiguous1RolesAndLabelsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifierKeywordsAmbiguous1RolesAndLabels`.
     * @param ctx the parse tree
     */
    exitIdentifierKeywordsAmbiguous1RolesAndLabels?: (ctx: IdentifierKeywordsAmbiguous1RolesAndLabelsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifierKeywordsAmbiguous2Labels`.
     * @param ctx the parse tree
     */
    enterIdentifierKeywordsAmbiguous2Labels?: (ctx: IdentifierKeywordsAmbiguous2LabelsContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifierKeywordsAmbiguous2Labels`.
     * @param ctx the parse tree
     */
    exitIdentifierKeywordsAmbiguous2Labels?: (ctx: IdentifierKeywordsAmbiguous2LabelsContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.labelKeyword`.
     * @param ctx the parse tree
     */
    enterLabelKeyword?: (ctx: LabelKeywordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.labelKeyword`.
     * @param ctx the parse tree
     */
    exitLabelKeyword?: (ctx: LabelKeywordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifierKeywordsAmbiguous3Roles`.
     * @param ctx the parse tree
     */
    enterIdentifierKeywordsAmbiguous3Roles?: (ctx: IdentifierKeywordsAmbiguous3RolesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifierKeywordsAmbiguous3Roles`.
     * @param ctx the parse tree
     */
    exitIdentifierKeywordsAmbiguous3Roles?: (ctx: IdentifierKeywordsAmbiguous3RolesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifierKeywordsUnambiguous`.
     * @param ctx the parse tree
     */
    enterIdentifierKeywordsUnambiguous?: (ctx: IdentifierKeywordsUnambiguousContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifierKeywordsUnambiguous`.
     * @param ctx the parse tree
     */
    exitIdentifierKeywordsUnambiguous?: (ctx: IdentifierKeywordsUnambiguousContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.roleKeyword`.
     * @param ctx the parse tree
     */
    enterRoleKeyword?: (ctx: RoleKeywordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.roleKeyword`.
     * @param ctx the parse tree
     */
    exitRoleKeyword?: (ctx: RoleKeywordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.lValueKeyword`.
     * @param ctx the parse tree
     */
    enterLValueKeyword?: (ctx: LValueKeywordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.lValueKeyword`.
     * @param ctx the parse tree
     */
    exitLValueKeyword?: (ctx: LValueKeywordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.identifierKeywordsAmbiguous4SystemVariables`.
     * @param ctx the parse tree
     */
    enterIdentifierKeywordsAmbiguous4SystemVariables?: (ctx: IdentifierKeywordsAmbiguous4SystemVariablesContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.identifierKeywordsAmbiguous4SystemVariables`.
     * @param ctx the parse tree
     */
    exitIdentifierKeywordsAmbiguous4SystemVariables?: (ctx: IdentifierKeywordsAmbiguous4SystemVariablesContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.roleOrIdentifierKeyword`.
     * @param ctx the parse tree
     */
    enterRoleOrIdentifierKeyword?: (ctx: RoleOrIdentifierKeywordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.roleOrIdentifierKeyword`.
     * @param ctx the parse tree
     */
    exitRoleOrIdentifierKeyword?: (ctx: RoleOrIdentifierKeywordContext) => void;
    /**
     * Enter a parse tree produced by `MySQLParser.roleOrLabelKeyword`.
     * @param ctx the parse tree
     */
    enterRoleOrLabelKeyword?: (ctx: RoleOrLabelKeywordContext) => void;
    /**
     * Exit a parse tree produced by `MySQLParser.roleOrLabelKeyword`.
     * @param ctx the parse tree
     */
    exitRoleOrLabelKeyword?: (ctx: RoleOrLabelKeywordContext) => void;
}

