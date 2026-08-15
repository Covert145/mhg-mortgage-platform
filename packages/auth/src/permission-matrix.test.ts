import { describe, expect, it } from "vitest";
import { PermissionAction } from "@mhg/db";
import { hasPermission } from "./permission-matrix";

describe("hasPermission", () => {
  it("grants when an exact resource/action match exists", () => {
    const grants = [{ resource: "contacts", action: PermissionAction.CREATE }];
    expect(hasPermission(grants, "contacts", PermissionAction.CREATE)).toBe(true);
  });

  it("denies when the resource is not granted at all", () => {
    const grants = [{ resource: "contacts", action: PermissionAction.CREATE }];
    expect(hasPermission(grants, "loanFiles", PermissionAction.CREATE)).toBe(false);
  });

  it("denies when the resource is granted but not the requested action", () => {
    const grants = [{ resource: "contacts", action: PermissionAction.VIEW }];
    expect(hasPermission(grants, "contacts", PermissionAction.DELETE)).toBe(false);
  });

  it("MANAGE implies VIEW/CREATE/EDIT/DELETE on the same resource", () => {
    const grants = [{ resource: "loanFiles", action: PermissionAction.MANAGE }];
    expect(hasPermission(grants, "loanFiles", PermissionAction.VIEW)).toBe(true);
    expect(hasPermission(grants, "loanFiles", PermissionAction.CREATE)).toBe(true);
    expect(hasPermission(grants, "loanFiles", PermissionAction.EDIT)).toBe(true);
    expect(hasPermission(grants, "loanFiles", PermissionAction.DELETE)).toBe(true);
  });

  it("MANAGE on one resource does not leak to a different resource", () => {
    const grants = [{ resource: "loanFiles", action: PermissionAction.MANAGE }];
    expect(hasPermission(grants, "underwriting", PermissionAction.VIEW)).toBe(false);
  });

  it("returns false for an empty grant set", () => {
    expect(hasPermission([], "contacts", PermissionAction.VIEW)).toBe(false);
  });
});
