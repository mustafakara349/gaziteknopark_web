using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaziTeknoparkApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamMemberParentIdRemoveRoleLevel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "role_level",
                table: "team_members");

            migrationBuilder.AddColumn<uint>(
                name: "parent_id",
                table: "team_members",
                type: "int unsigned",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_team_members_parent_id",
                table: "team_members",
                column: "parent_id");

            migrationBuilder.AddForeignKey(
                name: "fk_team_members_team_members_parent_id",
                table: "team_members",
                column: "parent_id",
                principalTable: "team_members",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_team_members_team_members_parent_id",
                table: "team_members");

            migrationBuilder.DropIndex(
                name: "ix_team_members_parent_id",
                table: "team_members");

            migrationBuilder.DropColumn(
                name: "parent_id",
                table: "team_members");

            migrationBuilder.AddColumn<string>(
                name: "role_level",
                table: "team_members",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
