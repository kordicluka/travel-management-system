import { PageHeader, LoadingSpinner, ErrorMessage } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProfile, useLogout } from "../hooks";
import { LogOut, Mail, Calendar, User as UserIcon } from "lucide-react";

export const ProfilePage = () => {
  const { data: user, isLoading, error } = useProfile();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="My Profile" />
        <LoadingSpinner text="Loading profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="My Profile" />
        <ErrorMessage
          title="Failed to load profile"
          message={error instanceof Error ? error.message : "An error occurred"}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <PageHeader title="My Profile" />
        <ErrorMessage
          title="No profile data"
          message="Unable to load your profile information"
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader title="My Profile" />

      <div className="mt-8 space-y-6">
        {/* User Information Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Account Details</h2>
              <p className="text-sm text-muted-foreground">
                Your personal information
              </p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email Address
                </p>
                <p className="text-base">{user.email}</p>
              </div>
            </div>

            {/* Account Created */}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Member Since
                </p>
                <p className="text-base">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </p>
                <p className="text-base">
                  {new Date(user.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
          <Separator className="mb-4" />

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
