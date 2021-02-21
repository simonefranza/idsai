#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char* argv[])
{
  if(argc != 2)
    return -1;

  FILE* src = fopen(argv[1], "r");

  char destName[100] = {0};
  strcpy(destName, argv[1]);
  strcat(destName, ".json");

  FILE* dest = fopen(destName, "w");
  fprintf(dest, "{\n\"data\": \"");

  char ch;
  while((ch = fgetc(src)) != EOF)
  {
    if(ch == '\n')
    {
      fprintf(dest, "\\n");
      continue;
    }
    else if(ch == '\b')
    {
      fprintf(dest, "\\b");
      continue;
    }
    else if(ch == '\f')
    {
      fprintf(dest, "\\f");
      continue;
    }
    else if(ch == '\r')
    {
      fprintf(dest, "\\r");
      continue;
    }
    else if(ch == '\t')
    {
      fprintf(dest, "\\t");
      continue;
    }
    else if(ch == '"')
    {
      fputc('\\', dest);
      fputc('"', dest);
      continue;
    }
    else if(ch == '\\')
    {
      fputc('\\', dest);
      fputc('\\', dest);
      continue;
    }

    fputc(ch == '"' ? '\'' : ch, dest);
  }

  fprintf(dest, "\"\n}");
  fclose(dest);
  fclose(src);

  return 0;

}
