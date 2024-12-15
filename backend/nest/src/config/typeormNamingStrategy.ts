/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @stylistic/quotes */
// eslint-disable-next-line max-classes-per-file
import { DefaultNamingStrategy, type NamingStrategyInterface } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils.js";

export class SnakeNamingStrategy
    extends DefaultNamingStrategy
    implements NamingStrategyInterface {
    override tableName(
        // eslint-disable-next-line unicorn/no-keyword-prefix
        className: string,
        userSpecifiedName: string | undefined,
    ) {
        // "Nullish Coalescing" ab ES2020
        return userSpecifiedName ?? snakeCase(className);
    }

    override columnName(
        propertyName: string,
        customName: string | undefined,
        embeddedPrefixes: string[],
    ) {
        return (
            snakeCase([...embeddedPrefixes, ""].join("_")) +
            (customName ?? snakeCase(propertyName))
        );
    }

    override relationName(propertyName: string) {
        return snakeCase(propertyName);
    }

    override joinColumnName(
        relationName: string,
        referencedColumnName: string,
    ) {
        return snakeCase(`${relationName}_${referencedColumnName}`);
    }

    // eslint-disable-next-line max-params
    override joinTableName(
        firstTableName: string,
        secondTableName: string,
        firstPropertyName: string,
        _: string,
    ) {
        return snakeCase(
            `${firstTableName}_${firstPropertyName.replaceAll(
                ".",
                "_",
            )}_${secondTableName}`,
        );
    }

    override joinTableColumnName(
        tableName: string,
        propertyName: string,
        columnName?: string,
    ) {
        return snakeCase(`${tableName}_${columnName ?? propertyName}`);
    }

    // eslint-disable-next-line unicorn/no-keyword-prefix
    classTableInheritanceParentColumnName(
        parentTableName: any,
        parentTableIdPropertyName: any,
    ) {
        return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`);
    }

    eagerJoinRelationAlias(alias: string, propertyPath: string) {
        return `${alias}__${propertyPath.replace(".", "_")}`;
    }
}
export class OracleNamingStrategy extends SnakeNamingStrategy {
    override tableName(targetName: string, userSpecifiedName: string): string {
        return super.tableName(targetName, userSpecifiedName).toUpperCase();
    }

    override columnName(
        propertyName: string,
        customName: string,
        embeddedPrefixes: string[],
    ) {
        return super
            .columnName(propertyName, customName, embeddedPrefixes)
            .toUpperCase();
    }

    override relationName(propertyName: string) {
        return super.relationName(propertyName).toUpperCase();
    }

    override joinColumnName(
        relationName: string,
        referencedColumnName: string,
    ) {
        return super
            .joinColumnName(relationName, referencedColumnName)
            .toUpperCase();
    }

    // eslint-disable-next-line max-params
    override joinTableName(
        firstTableName: string,
        secondTableName: string,
        firstPropertyName: string,
        secondPropertyName: string,
    ) {
        return super
            .joinTableName(
                firstTableName,
                secondTableName,
                firstPropertyName,
                secondPropertyName,
            )
            .toUpperCase();
    }

    override joinTableColumnName(
        tableName: string,
        propertyName: string,
        columnName?: string,
    ) {
        return super
            .joinTableColumnName(tableName, propertyName, columnName)
            .toUpperCase();
    }

    // eslint-disable-next-line unicorn/no-keyword-prefix
    override classTableInheritanceParentColumnName(
        parentTableName: any,
        parentTableIdPropertyName: any,
    ) {
        return super
            .classTableInheritanceParentColumnName(
                parentTableName,
                parentTableIdPropertyName,
            )
            .toUpperCase();
    }

    override eagerJoinRelationAlias(alias: string, propertyPath: string) {
        return super.eagerJoinRelationAlias(alias, propertyPath).toUpperCase();
    }
}
